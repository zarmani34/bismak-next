import Link from "next/link";
import { FaBell } from "react-icons/fa";
import Image from "next/image";
import UserMenu from "./UserMenu";

export default function PortalHeader() {
  const currentUser = {
    name: "Bayo Ismail",
    role: "client", // client, staff, admin
    avatar: "/api/placeholder/40/40",
    company: "TechCorp Industries",
  };
  const notifications = [
    {
      id: 1,
      type: "warning",
      message: "Certificate expiring in 7 days - Lagos Terminal",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "New service request submitted",
      time: "4 hours ago",
    },
  ];
  return (
    <header className="bg-linear-to-r from-primary-dark via-primary to-primary-dark  border-b border-tetiary/20 fixed top-0 left-0 w-full z-40">
      <div className="flex items-center justify-between h-16 px-2 md:px-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="w-24 md:w-36 h-12 bg-linear-to-r from-tetiary/60 to-tetiary/70 rounded-lg py-1 px-2 shadow-md"
          >
            <Image
              src={"/Bismak.svg"}
              alt="Bismak logo"
              width={96}
              height={48}
              className="w-full h-full object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-tetiary hover:bg-secondary-dark rounded-lg relative">
              <FaBell className=" w-5 h-5md:w-6 md:h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
