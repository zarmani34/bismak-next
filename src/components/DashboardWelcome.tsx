'use client';
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PrimaryButton from "./buttons/PrimaryButton";

export default function DashboardWelcome({ text, buttonText }: { text: string; buttonText?: string }) {
    const {data: currentUser} = useCurrentUser();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10 shadow-md hover:shadow-lg p-4 rounded-2xl w-full transition-all duration-300">
      <h2 className="text-primary-dark text-2xl font-medium">
        Welcome back, <span className="text-secondary-dark">{currentUser?.full_name.split(" ")[0]}</span>
        <p className="text-secondary-text text-base">{text}</p>
      </h2>
      {buttonText && <PrimaryButton tittle={buttonText} />}
    </div>
  );
}
