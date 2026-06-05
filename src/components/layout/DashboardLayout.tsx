import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { isAuthenticated, currentUser, sidebarOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate("/login");
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!isAuthenticated || !currentUser) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? "256px" : "64px" }}
      >
        <DashboardHeader title={title} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
