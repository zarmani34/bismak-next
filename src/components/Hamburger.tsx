import React, { forwardRef } from "react";
type HarmburgerProps = {
  showMenu: boolean;
  handleMenuToggle: () => void;
  // harmburgerRef: React.RefObject<HTMLDivElement | null>;
}
const Harmburger = forwardRef<HTMLDivElement, HarmburgerProps>(({ showMenu, handleMenuToggle }, ref) => {
    
  return (
    <div
      ref={ref}
      className="md:hidden z-10 cursor-pointer transition-all duration-300"
      id="menu-icon"
      onClick={handleMenuToggle}
    >
      {/* Top bar */}
      <div
        className={`w-7 h-1  my-1.5 rounded-xl transition-all duration-300 ${
          showMenu ? "bg-secondary-dark translate-y-2 rotate-[-45deg]" : "translate-y-0 rotate-0 bg-tetiary "
        }`}
      />

      {/* Middle bar */}
      <div
        className={`w-7 h-1 bg-tetiary my-1.5 rounded-xl transition-all duration-300 ${
          showMenu ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Bottom bar */}
      <div
        className={`w-7 h-1 bg-tetiary my-1.5 rounded-xl transition-all duration-300 ${
          showMenu ? "bg-secondary-dark -translate-y-2 rotate-45" : "translate-y-0 rotate-0 bg-tetiary"
        }`}
      />
    </div>
  );
});

export default Harmburger;
