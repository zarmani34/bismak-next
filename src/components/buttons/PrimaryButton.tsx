import { TypePrimaryButtonProps } from "@/src/utils/types";
import React from "react";

const PrimaryButton = ({ tittle, icon }:TypePrimaryButtonProps) => {
  return (
    <div className="bg-primary text-tetiary font-medium py-4 px-6 md:p-4 rounded-2xl flex items-center gap-2 text-sm hover:bg-primary-dark transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {tittle}
      {icon && <span>{icon}</span>}
    </div>
  );
};

export default PrimaryButton;
