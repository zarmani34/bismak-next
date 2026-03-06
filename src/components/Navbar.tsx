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
          <div className="relative" ref={portalMenuRef}>
            <button
              type="button"
              onClick={() => setIsPortalMenuOpen((prev) => !prev)}
              className="text-tetiary font-medium hover:text-secondary-light uppercase transition-colors duration-300 inline-flex items-center gap-2 md:px-3 md:py-2 md:rounded-lg md:border md:border-transparent md:hover:border-secondary-light/20 md:hover:bg-white/5"
            >
              Portal
              <FaChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isPortalMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isPortalMenuOpen && (
              <div className="mt-2 md:mt-4 md:absolute md:top-full md:left-1/2 md:-translate-x-1/2 w-full md:min-w-56 md:w-max rounded-xl overflow-hidden border border-secondary-light/20 bg-primary/95 shadow-xl z-40 p-1">
                {portalOptions.map((portal) => (
                  <Link
                    key={portal.href}
                    href={portal.href}
                    onClick={() => setIsPortalMenuOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-tetiary hover:text-tetiary-light hover:bg-tetiary/20 transition-colors"
                  >
                    {portal.label}
                  </Link>
                ))}
              </div>
            )}
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
