"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import LeakTestFormPage from "../../../../../components/project-tests/LeakTestFormPage";

export default function AdminLeakTestPage() {
  const { data: currentUser } = useCurrentUser();
  return (currentUser?.role === "admin" || currentUser?.role === "staff") ? <LeakTestFormPage role="admin" mode="create" /> : <div className="flex items-center justify-center h-full">
    <p className="text-lg text-primary font-mono font-bold mt-16">You do not have permission to access this page.</p>
  </div>;
}
