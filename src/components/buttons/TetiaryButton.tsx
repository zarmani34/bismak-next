import { TypeTetiaryButtonProps } from "@/src/utils/types";
import React from "react";

const TetiaryButton = ({ tittle, icon }:TypeTetiaryButtonProps) => {
  return (
    <div className="bg-transparent text-primary font-medium border-2 border-primary py-4 px-6 md:p-4 rounded-2xl flex items-center gap-2 text-sm  transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:bg-primary-dark hover:text-tetiary">
      {tittle}
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default TetiaryButton;
