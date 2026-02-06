"use client";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Link from "next/link";
import { ADMINPORTALMENU, CLIENTPORTALMENU, STAFFPORTALMENU } from "../constants";
import { useState } from "react";
import { usePathname } from "next/navigation";

const PortalSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  type PortalType = "client" | "staff" | "admin";
  let portalType: PortalType = "client"; 


if (pathname.startsWith("/portal/client")) {
  portalType = "client";
} else if (pathname.startsWith("/portal/staff")) {
  portalType = "staff";
} else if (pathname.startsWith("/portal/admin")) {
  portalType = "admin";
}

const portalMenus = {
  client: CLIENTPORTALMENU,
  staff: STAFFPORTALMENU,
  admin: ADMINPORTALMENU,
};

const currentMenu = portalMenus[portalType];



  return (
    <>
      {/* Mobile Overlay */}
      {/* {showMenu && (
        <div
          className="md:hidden fixed inset-0 bg-gradient-to-r from-primary-light/10 to-primary-light/20 backdrop-blur-sm bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )} */}

      {/* Sidebar */}
      <nav
        className={`
        bg-linear-to-br from-primary-dark to-primary text-tetiary 
        h-full overflow-hidden transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? "w-20" : "w-64"}
        /* Mobile styles */
        mt-16 transform relative
        
        /* Desktop styles */
        md:transform-none md:z-0 
      `}
      >
        <div className="hidden md:block absolute -right-4 top-4 z-10 w-8 h-8">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`bg-tetiary shadow-lg rounded-full p-2 hover:text-primary-dark transition-colors duration-200 text-primary`}
          >
            {isCollapsed ? (
              <div className=" relative -left-1 top-0">
                <FaAngleRight />
              </div>
            ) : (
              <div className=" relative -left-1 top-0">
                <FaAngleLeft />
              </div>
            )}
          </button>
        </div>
        <div
          className={`hidden md:block w-full text-center p-4 border-b border-tetiary/20 mb-2 transition-all duration-300 px-8
          }`}
        >
          {/* {!isCollapsed ? ( */}
          <h2 className="text-2xl font-medium uppercase">Client Portal</h2>
          {/* // ) : ( */}
          {/* //   <div className="text-xl font-bold">CP</div> */}
          {/* // )} */}
        </div>

        {/* Navigation Menu */}
        <ul className="p-4 space-y-2">
          {currentMenu.map((item) => (
            <li key={item.key}>
              <Link
                href={`/portal/client/${item.key}`} //`/portal/client/${item.key}`}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ease-in-out
          hover:bg-tetiary/10 hover:translate-x-1 group relative `}
              >
                <span
                  className={`w-5 h-5 stroke-current fill-none stroke-2 mr-3 transition-all duration-300 ease-in-out`}
                >
                  {item.icon}
                </span>
                <span
                  className={`
  font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
  opacity-100 translate-x-0 w-auto
  }
`}
                >
                  {item.label}
                </span>
                {/* {active === item.key && <span className="absolute top-1/2 left-0 w-1 h-1/3 -translate-y-1/2 transition-all duration-300 ease-in-out bg-secondary rounded-sm"></span>} */}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default PortalSidebar;
