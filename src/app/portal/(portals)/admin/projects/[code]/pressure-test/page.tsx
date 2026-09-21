"use client";

import PressureTestWizard from "@/src/app/portal/components/PressureTestWizard";
import PressureTestFormPage from "../../../../../components/project-tests/PressureTestFormPage";

export default function AdminPressureTestPage() {
  return <PressureTestWizard role="admin" mode="create" />;
}
