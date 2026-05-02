"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { extractApiError } from "@/lib/errors";
import {
  useUpdateQuoteStatus,
  useUpdateServiceRequestStatus,
} from "@/hooks/useServices";
import { ServiceRequestDetail } from "@/schemas/services";
import {
  extractInvoiceCode,
  extractQuoteCode,
  getServiceActions,
  PortalRole,
  ServiceActionKey,
} from "../../utils/serviceActions";
import CreateQuoteModal from "../modals/CreateQuoteModal";

type ServiceUpdateStatusProps = {
  serviceRequest: ServiceRequestDetail;
  role: PortalRole;
  serviceCode: string;
};

const getBillingBase = (role: PortalRole) =>
  role === "admin"
    ? "/portal/admin/billing"
    : role === "client"
      ? "/portal/client/billings"
      : "/portal/staff/billings";

export default function ServiceUpdateStatus({
  serviceRequest,
  role,
  serviceCode,
}: ServiceUpdateStatusProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const router = useRouter();

  const updateServiceStatus = useUpdateServiceRequestStatus();
  const updateQuoteStatus = useUpdateQuoteStatus();

  const quoteCode = useMemo(() => extractQuoteCode(serviceRequest), [serviceRequest]);
  const invoiceCode = useMemo(() => extractInvoiceCode(serviceRequest), [serviceRequest]);

  const nextActions = getServiceActions({
    role,
    status: serviceRequest.status,
    hasQuote: !!quoteCode,
    hasInvoice: !!invoiceCode,
    scope: "detail",
  });

  const isBusy = updateServiceStatus.isPending || updateQuoteStatus.isPending;

  const handleNextAction = async (actionKey: ServiceActionKey) => {
    setActionError(null);

    try {
      if (actionKey === "mark_reviewed") {
        await updateServiceStatus.mutateAsync({
          serviceCode,
          status: "reviewed",
        });
        return;
      }

      if (actionKey === "assign_staff") {
        await updateServiceStatus.mutateAsync({
          serviceCode,
          status: "in_progress",
        });
        return;
      }

      if (actionKey === "mark_completed") {
        await updateServiceStatus.mutateAsync({
          serviceCode,
          status: "completed",
        });
        return;
      }

      if (actionKey === "create_quote") {
        setShowCreateQuote(true);
        return;
      }

      if (actionKey === "accept_quote" || actionKey === "reject_quote") {
        if (!quoteCode) {
          setActionError("No quote is linked to this service request yet.");
          return;
        }

        await updateQuoteStatus.mutateAsync({
          quoteCode,
          status: actionKey === "accept_quote" ? "accepted" : "rejected",
        });
        return;
      }

      if (actionKey === "view_invoice") {
        const billingBase = getBillingBase(role);

        if (invoiceCode) {
          router.push(`${billingBase}/invoices/${invoiceCode}`);
          return;
        }

        router.push(billingBase);
      }
    } catch (error) {
      setActionError(extractApiError(error));
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-primary-light/20 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-primary-dark">Status Actions</h2>
            <p className="text-sm text-secondary-text">
              Current status: <span className="font-medium text-primary-dark">{serviceRequest.status_display}</span>
            </p>
          </div>
        </div>

        {nextActions.length === 0 ? (
          <p className="text-xs text-secondary-text">No further updates allowed at this stage.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {nextActions.map((action) => (
              <button
                key={action.key}
                type="button"
                disabled={isBusy}
                onClick={() => void handleNextAction(action.key)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors disabled:opacity-60 ${
                  action.tone === "primary"
                    ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                    : "border-border text-primary-dark hover:bg-primary-light/20"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {actionError ? <p className="text-xs text-secondary-light">{actionError}</p> : null}
      </div>

      <CreateQuoteModal
        open={showCreateQuote}
        onClose={() => setShowCreateQuote(false)}
        defaultLinkType="service"
        defaultLinkedCode={serviceCode}
        lockLinkedRecord
        onSuccess={async () => {
          await updateServiceStatus.mutateAsync({
            serviceCode,
            status: "quoted",
          });
        }}
      />
    </>
  );
}
