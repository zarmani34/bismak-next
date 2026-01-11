"use client";

import { useState } from "react";
import SecondaryButton from "./buttons/SecondaryButton";
import QuickRequestModal from "./modals/RequestModal";
import Link from "next/link";


type NavbarProps = {
  showMenu: boolean;
  activeSection: string;
};

const Navbar = ({ showMenu, activeSection }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {
        <nav
          className={`flex flex-col gap-2 absolute top-full bg-primary left-0 w-full py-5 px-5 md:px-0 z-30 space-y-3 
      md:flex md:flex-row md:items-center md:bg-transparent md:space-y-0 md:relative md:right-2 md:top-0 md:w-fit md:gap-4
      
      ${showMenu ? "block" : "hidden"} md:block`}
        >
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-tetiary font-medium hover:text-secondary-light uppercase transition-all duration-300 ease-in-out`}
              style={
                activeSection === item.toLowerCase()
                  ? { color: "#e67d5f" }
                  : undefined
              }
            >
              {item}
            </a>
          ))}
          <Link
            href={"/portal/client/dashboard"}
            className="text-tetiary font-medium hover:text-secondary-light uppercase transition-colors duration-3000"
          >
            portal
          </Link>
          <div onClick={() => setIsOpen(!isOpen)}>
            <SecondaryButton tittle="Quick Request" />
          </div>
          <QuickRequestModal isOpen={isOpen} onClose={onClose} />
        </nav>
      }
    </>
  );
};

export default Navbar;
