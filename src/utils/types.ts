import { Dispatch, SetStateAction } from "react";

export type TypeSetActiveSection = {
  setActiveSection: Dispatch<SetStateAction<string>>
}

export type TypeScrollInView = [
  (node?: HTMLElement | null) => void,
  boolean
];

