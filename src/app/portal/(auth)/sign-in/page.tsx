import { Suspense } from "react";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginFormPage() {
  return (
    <Suspense
      fallback={<div className="text-center text-sm text-primary-dark">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
