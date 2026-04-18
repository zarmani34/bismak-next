import { ServiceRequestDetail } from "@/schemas/services";
import {
  extractInvoiceCode,
  extractQuoteCode,
  getServiceActions,
  ServiceActionKey,
} from "../../utils/serviceActions";
import SecondaryButton from "@/src/components/buttons/SecondaryButton";
import { useState } from "react";
import { extractApiError } from "@/lib/errors";
import { useRouter } from "next/navigation";
import {
  useUpdateQuoteStatus,
  useUpdateServiceRequestStatus,
} from "@/hooks/useServices";

type ServiceUpdateStatusProps = {
  serviceRequest: ServiceRequestDetail; // Replace 'any' with the actual type for your service request
};

export default function ServiceUpdateStatus({
  serviceRequest,
}: ServiceUpdateStatusProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const router = useRouter();
  const updateServiceStatus = useUpdateServiceRequestStatus();
  const updateQuoteStatus = useUpdateQuoteStatus();
  const role = "admin";
  const nextAction = getServiceActions({
    role: role,
    status: serviceRequest.status,
    hasQuote: !!serviceRequest.quote_code,
    hasInvoice: !!serviceRequest.invoice_code,
    scope: "detail",
  });

  const handleNextAction = async (
    service: ServiceRequestDetail,
    actionKey: ServiceActionKey,
  ) => {
    setActionError(null);

    try {
      if (actionKey === "mark_reviewed") {
        await updateServiceStatus.mutateAsync({
          serviceCode: service.code,
          status: "reviewed",
        });
        return;
      }

      if (actionKey === "mark_completed") {
        await updateServiceStatus.mutateAsync({
          serviceCode: service.code,
          status: "completed",
        });
        return;
      }

      if (actionKey === "accept_quote" || actionKey === "reject_quote") {
        const quoteCode = extractQuoteCode(service);
        if (!quoteCode) return;

        await updateQuoteStatus.mutateAsync({
          quoteCode,
          status: actionKey === "accept_quote" ? "accepted" : "rejected",
        });
        return;
      }

      if (actionKey === "view_invoice") {
        const invoiceCode = extractInvoiceCode(service);
        if (!role) return;

        const billingBase =
          role === "admin"
            ? "/portal/admin/billing"
            : role === "client"
              ? "/portal/client/billings"
              : "/portal/staff/billings";
        const query = invoiceCode
          ? `?invoice=${encodeURIComponent(invoiceCode)}`
          : "";
        router.push(`${billingBase}${query}`);
      }
    } catch (error) {
      setActionError(extractApiError(error));
    }
  };
  return (
    <div className="rounded-2xl border border-border bg-primary-light/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-primary-dark">
              Update Status
            </h2>
            <p className="text-sm text-secondary-text py-1">
              Current status:{" "}
              <span className="">{serviceRequest.status.toUpperCase()}</span>
            </p>
          </div>
        </div>
        <span className="text-xs text-secondary-text mt-4">
          {nextAction.length === 0
            ? "No further updates allowed."
            : nextAction.map((action, index) => (
                <p>
                  Next action:{" "}
                  <span className="">{action.label.toUpperCase()}</span>
                </p>
              ))}
        </span>
      </div>
      <div>
        {nextAction.map((action) => (
          <div
            className="my-2"
            key={action.label}
            onClick={(event) => {
              event.stopPropagation();
              void handleNextAction(serviceRequest, action.key);
            }}
          >
            <SecondaryButton tittle={action.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
