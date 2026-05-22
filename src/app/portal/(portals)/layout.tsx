import { NotificationProvider } from "@/src/context/NotificationContext";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSideBar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NotificationProvider>
        <PortalHeader />
        <div className="flex flex-1 overflow-hidden">
          <PortalSidebar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-16 p-4">{children}</div>
          </main>
        </div>
      </NotificationProvider>
    </div>
  );
}
