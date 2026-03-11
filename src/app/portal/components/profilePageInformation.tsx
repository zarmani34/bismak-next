import { User } from "@/schemas/user";
import { FaPhone } from "react-icons/fa";
import { FaEnvelope, FaIdBadge } from "react-icons/fa6";

type Props = {
  currentUser?: User;
};

const toTitleCase = (value?: string) => {
  if (!value) return "User";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function ProfilePageInformation({currentUser}: Props) {
  const fullName = currentUser?.full_name || "Loading user...";
  const roleLabel = toTitleCase(currentUser?.role);
  const portalLabel = toTitleCase(currentUser?.portal || currentUser?.role);
  
  return (
  <div className="xl:col-span-2 space-y-6">
    <div className="rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary-light/40 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary-dark">
          Personal Information
        </h2>
      </div>
      <div className="p-6 bg-primary-light/10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-tetiary/80 p-4">
          <p className="text-xs text-secondary-text">Full Name</p>
          <p className="text-sm font-medium text-primary-dark">{fullName}</p>
        </div>
        <div className="rounded-lg border border-border bg-tetiary/80 p-4">
          <p className="text-xs text-secondary-text">Role</p>
          <p className="text-sm font-medium text-primary-dark">{roleLabel}</p>
        </div>
        <div className="rounded-lg border border-border bg-tetiary/80 p-4 flex items-start gap-3">
          <FaEnvelope className="w-4 h-4 text-secondary-text mt-0.5" />
          <div>
            <p className="text-xs text-secondary-text">Email</p>
            <p className="text-sm font-medium text-primary-dark">
              {currentUser?.email || "Not available"}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-tetiary/80 p-4 flex items-start gap-3">
          <FaPhone className="w-4 h-4 text-secondary-text mt-0.5" />
          <div>
            <p className="text-xs text-secondary-text">Phone</p>
            <p className="text-sm font-medium text-primary-dark">
              {currentUser?.phone_number || "Not available"}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-tetiary/80 p-4 flex items-start gap-3 md:col-span-2">
          <FaIdBadge className="w-4 h-4 text-secondary-text mt-0.5" />
          <div>
            <p className="text-xs text-secondary-text">Portal</p>
            <p className="text-sm font-medium text-primary-dark">
              {portalLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>);
}
