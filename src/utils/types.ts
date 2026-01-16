import { Dispatch, SetStateAction } from "react";

export type TypeSecondaryButtonProps = {
  tittle: string;
  icon?: React.ReactNode;
};
export type TypePrimaryButtonProps = {
  tittle: string;
  icon?: React.ReactNode;
};
export type TypeTetiaryButtonProps = {
  tittle: string;
  icon?: React.ReactNode;
};

export type TypeSetActiveSection = {
  setActiveSection: Dispatch<SetStateAction<string>>
}

export type TypeScrollInView = [
  (node?: HTMLElement | null) => void,
  boolean
];

export interface Client {
  id: number;
  name: string;
  abbreviation: string;
  img?: string
}