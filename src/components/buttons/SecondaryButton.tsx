import { TypeSecondaryButtonProps } from "@/src/utils/types";
import React from "react";

const  SecondaryButton = ({ tittle, icon }: TypeSecondaryButtonProps) => {
  return (
    <div className="bg-secondary text-tetiary font-medium py-4 px-6 md:p-4 rounded-2xl flex items-center gap-2 text-sm hover:bg-secondary-dark transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {tittle}
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default SecondaryButton;
