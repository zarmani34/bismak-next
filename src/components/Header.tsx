"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import Harmburger from "./Hamburger";
export const Header = ({activeSection}: {activeSection: string}) => {
  const [showMenu, setShowMenu] = useState(false);
  const harmburgerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log(harmburgerRef.current); // HTMLDivElement
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      harmburgerRef.current &&
      !harmburgerRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  };
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };
  return (
    <header className="w-full bg-primary flex justify-between items-center lg:px-8 px-4 py-1 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-12 h-8 md:w-28 md:h-14 border-2 border-border">
          <img
            src="/logo.jpg"
            alt="Bismak Logo"
            className="w-full h-full"
          />
        </div>
        <div className="">
          <h1 className="md:text-2xl text-xl font-bold tracking-widest uppercase text-tetiary">
            Bismak{" "}
          </h1>
          <div className="text-xs uppercase -mt-1 text-tetiary/65">
            Excel & Technical Services
          </div>
        </div>
      </div>
      <Navbar showMenu={showMenu} activeSection={activeSection} />
      <Harmburger showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
    </header>
  );
};
