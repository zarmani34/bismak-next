"use client";

import { useState } from "react";
import CreateStaffAdminModal from "../../../components/modals/CraeteStaffAdminModal";
import { useUsers } from "@/hooks/useUsers";
import { formatDateTime } from "@/src/utils/date";

type RoleTab = "all" | "admin" | "staff" | "client";

const TABS: { key: RoleTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "admin", label: "Admin" },
  { key: "staff", label: "Staff" },
  { key: "client", label: "Client" },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<RoleTab>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: users, isLoading, isError } = useUsers(
    activeTab === "all" ? undefined : { role: activeTab }
  );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Users</h1>
          <p className="text-secondary-text text-sm sm:text-base">
            Manage admin, staff, and client accounts
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-semibold text-tetiary
            bg-[#D95C3E] hover:bg-secondary-dark transition-colors"
        >
          + Add Staff / Admin
        </button>
      </div>

      {/* Role tabs */}
      <div className="flex gap-1 bg-primary-light/40 border-b border-tetiary rounded-tl-xl rounded-tr-xl">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-secondary-text text-sm sm:text-base transition-colors relative
              ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-[#8a8a8a] hover:text-body-text"
              }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className="bg-primary-light/10 rounded-bl-xl rounded-br-xl overflow-hidden"
        style={{ boxShadow: "0 6px 18px rgba(26, 36, 33, 0.06)" }}
      >
        {isLoading && (
          <div className="p-8 text-center text-sm text-[#8a8a8a]">
            Loading users…
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-error">
            Failed to load users.
          </div>
        )}

        {users && users.length === 0 && (
          <div className="p-8 text-center text-sm text-[#8a8a8a]">
            No users found.
          </div>
        )}

        {users && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-semibold text-body-text">Name</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Email</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Phone</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Role</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Verified</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Joined</th>
                  <th className="px-5 py-3 font-semibold text-body-text">Last login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.pk}
                    className="border-b border-border last:border-0 hover:bg-tetiary/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[#333333] font-medium">
                      {user.full_name}
                    </td>
                    <td className="px-5 py-3.5 text-body-text">{user.email}</td>
                    <td className="px-5 py-3.5 text-body-text">{user.phone_number}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold
                          ${
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : user.role === "staff"
                              ? "bg-[#D95C3E]/10 text-[#D95C3E]"
                              : "bg-info/10 text-info"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.is_verified ? (
                        <span className="text-success text-xs font-semibold">✓ Verified</span>
                      ) : (
                        <span className="text-[#8a8a8a] text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#8a8a8a] text-xs">
                      {
                      formatDateTime(user.date_joined)
                      }
                    </td>
                    <td className="px-5 py-3.5 text-[#8a8a8a] text-xs">
                      {
                      formatDateTime(user.last_login)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateStaffAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}