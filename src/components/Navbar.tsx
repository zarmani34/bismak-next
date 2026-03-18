"use client";

import { useEffect, useRef, useState } from "react";
import SecondaryButton from "./buttons/SecondaryButton";
import QuickRequestModal from "./modals/RequestModal";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa6";

type NavbarProps = {
  showMenu: boolean;
  activeSection: string;
};

const Navbar = ({ showMenu, activeSection }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false);
  const portalMenuRef = useRef<HTMLDivElement | null>(null);
  const onClose = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        portalMenuRef.current &&
        !portalMenuRef.current.contains(event.target as Node)
      ) {
        setIsPortalMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const portalOptions = [
    { label: "Client Portal", href: "/portal/client/dashboard" },
    { label: "Staff Portal", href: "/portal/staff/dashboard" },
    { label: "Admin Portal", href: "/portal/admin/dashboard" },
  ];

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
              className={`text-tetiary font-medium uppercase transition-all duration-300 ease-in-out inline-flex items-center md:px-3 md:py-2 md:rounded-lg md:border ${
                activeSection === item.toLowerCase()
                  ? "text-secondary-light md:bg-white/5 md:border-secondary-light/20"
                  : "md:border-transparent hover:text-secondary-light md:hover:border-secondary-light/20 md:hover:bg-white/5"
              }`}
            >
              {item}
            </a>
          ))}
          <div className="relative" ref={portalMenuRef}>
            <Link
              href="/portal"
              className="text-tetiary font-medium hover:text-secondary-light uppercase transition-colors duration-300 inline-flex items-center gap-2 md:px-3 md:py-2 md:rounded-lg md:border md:border-transparent md:hover:border-secondary-light/20 md:hover:bg-white/5"
            >
              Go to portal
            </Link>

            
          </div>
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
