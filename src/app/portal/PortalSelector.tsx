import { FaUserShield, FaUserTie } from "react-icons/fa6";
import { usePortal } from "./context";

export default function PortalSelector() {
  const { portal, setPortal } = usePortal();

  return (
    <div className="flex gap-3 mb-6">
      {[
        { id: "client" as const, icon: <FaUserShield />, label: "Client Portal" },
        { id: "staff" as const, icon: <FaUserTie />, label: "Staff Portal" },
        { id: "admin" as const, icon: <FaUserShield />, label: "Admin Portal" },
      ].map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPortal(p.id)}
          className={`flex-1 p-4 rounded-xl border-2 cursor-pointer text-center transition-all duration-300 hover:-translate-y-1 ${
            portal === p.id
              ? "border-primary "
              : "border-transparent bg-primary-light/20"
          }`}
        >
          <div className="text-2xl mb-1 text-primary-dark w-fit mx-auto">
            {p.icon}
          </div>
          <div className="font-semibold text-primary-dark text-sm">
            {p.label}
          </div>
        </button>
      ))}
    </div>
  );
}