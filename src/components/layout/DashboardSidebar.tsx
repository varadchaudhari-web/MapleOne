import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import type { UserRole } from "@/types";
import {
  Home,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Wrench,
  Building2,
  Store,
  BarChart3,
  UserCog,
  FileText,
  CreditCard,
  Calendar,
  MessageSquare,
  MapPin,
  Car,
  Package,
  AlertTriangle,
  Ticket,
  Star,
  TrendingUp,
  Globe,
  Activity,
  ClipboardList,
  Lock,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

const navByRole: Record<UserRole, NavItem[]> = {
  resident: [
    { label: "Dashboard", href: "/dashboard/resident", icon: Home },
    { label: "My Family", href: "/dashboard/resident/family", icon: Users },
    { label: "Visitors", href: "/dashboard/resident/visitors", icon: MapPin },
    { label: "Bills & Payments", href: "/dashboard/resident/bills", icon: CreditCard },
    { label: "Service Requests", href: "/dashboard/resident/requests", icon: Wrench },
    { label: "Facility Booking", href: "/dashboard/resident/facilities", icon: Calendar },
    { label: "Community Feed", href: "/dashboard/resident/community", icon: MessageSquare },
    { label: "Marketplace", href: "/dashboard/resident/marketplace", icon: Store },
    { label: "SOS & Safety", href: "/dashboard/resident/sos", icon: AlertTriangle },
    { label: "My Profile", href: "/dashboard/resident/profile", icon: UserCog },
  ],
  committee: [
    { label: "Dashboard", href: "/dashboard/committee", icon: Home },
    { label: "Residents", href: "/dashboard/committee/residents", icon: Users },
    { label: "Complaints", href: "/dashboard/committee/complaints", icon: AlertTriangle },
    { label: "Announcements", href: "/dashboard/committee/announcements", icon: Bell },
    { label: "Financials", href: "/dashboard/committee/financials", icon: CreditCard },
    { label: "Maintenance", href: "/dashboard/committee/maintenance", icon: Wrench },
    { label: "Polls & Events", href: "/dashboard/committee/engagement", icon: MessageSquare },
    { label: "Reports", href: "/dashboard/committee/reports", icon: BarChart3 },
    { label: "Society Settings", href: "/dashboard/committee/settings", icon: Settings },
  ],
  security: [
    { label: "Dashboard", href: "/dashboard/security", icon: Home },
    { label: "Visitor Entry", href: "/dashboard/security/visitors", icon: Users },
    { label: "QR Verification", href: "/dashboard/security/qr", icon: ShieldCheck },
    { label: "Vehicle Entry", href: "/dashboard/security/vehicles", icon: Car },
    { label: "Deliveries", href: "/dashboard/security/deliveries", icon: Package },
    { label: "Incident Reports", href: "/dashboard/security/incidents", icon: AlertTriangle },
    { label: "Visitor History", href: "/dashboard/security/history", icon: FileText },
  ],
  maintenance: [
    { label: "Dashboard", href: "/dashboard/maintenance", icon: Home },
    { label: "Ticket Queue", href: "/dashboard/maintenance/tickets", icon: Ticket },
    { label: "Work Orders", href: "/dashboard/maintenance/workorders", icon: ClipboardList },
    { label: "Vendor Assignment", href: "/dashboard/maintenance/vendors", icon: Store },
    { label: "Status Tracking", href: "/dashboard/maintenance/tracking", icon: Activity },
    { label: "Completed Work", href: "/dashboard/maintenance/completed", icon: FileText },
  ],
  vendor: [
    { label: "Dashboard", href: "/dashboard/vendor", icon: Home },
    { label: "Service Catalog", href: "/dashboard/vendor/catalog", icon: Store },
    { label: "Requests", href: "/dashboard/vendor/requests", icon: Ticket },
    { label: "Bookings", href: "/dashboard/vendor/bookings", icon: Calendar },
    { label: "Ratings & Reviews", href: "/dashboard/vendor/ratings", icon: Star },
    { label: "Earnings", href: "/dashboard/vendor/earnings", icon: TrendingUp },
  ],
  builder: [
    { label: "Dashboard", href: "/dashboard/builder", icon: Home },
    { label: "Properties", href: "/dashboard/builder/properties", icon: Building2 },
    { label: "Towers & Units", href: "/dashboard/builder/towers", icon: Building2 },
    { label: "Occupancy", href: "/dashboard/builder/occupancy", icon: Users },
    { label: "Community Health", href: "/dashboard/builder/health", icon: Activity },
    { label: "Reports", href: "/dashboard/builder/reports", icon: BarChart3 },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: Home },
    { label: "Communities", href: "/dashboard/admin/communities", icon: Globe },
    { label: "Users & Roles", href: "/dashboard/admin/users", icon: Users },
    { label: "Permissions", href: "/dashboard/admin/permissions", icon: Lock },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Audit Logs", href: "/dashboard/admin/logs", icon: FileText },
    { label: "Subscriptions", href: "/dashboard/admin/subscriptions", icon: CreditCard },
    { label: "Platform Monitor", href: "/dashboard/admin/monitor", icon: Activity },
    { label: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

const roleColors: Record<UserRole, string> = {
  resident: "from-blue-600 to-blue-800",
  committee: "from-purple-600 to-purple-800",
  security: "from-red-600 to-red-800",
  maintenance: "from-orange-600 to-orange-800",
  vendor: "from-teal-600 to-teal-800",
  builder: "from-indigo-600 to-indigo-800",
  admin: "from-gray-700 to-gray-900",
};

const roleLabels: Record<UserRole, string> = {
  resident: "Resident",
  committee: "Committee",
  security: "Security",
  maintenance: "Maintenance",
  vendor: "Vendor",
  builder: "Builder / PM",
  admin: "Super Admin",
};

export default function DashboardSidebar() {
  const { currentUser, logout, sidebarOpen, setSidebarOpen, notifications } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!currentUser) return null;

  const navItems = navByRole[currentUser.role] || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 flex flex-col ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
      style={{ background: "hsl(var(--sidebar-background))" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
        {sidebarOpen && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-maple rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">M1</span>
            </div>
            <span className="font-bold text-lg text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-red-400">Maple</span>
              <span className="text-amber-300">One</span>
            </span>
          </Link>
        )}
        {!sidebarOpen && (
          <div className="w-8 h-8 gradient-maple rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">M1</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft size={14} className="text-white/70" />
          ) : (
            <ChevronRight size={14} className="text-white/70" />
          )}
        </button>
      </div>

      {/* User Info */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${roleColors[currentUser.role]}`}>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
              <p className="text-white/70 text-xs truncate">{roleLabels[currentUser.role]}</p>
              {currentUser.flat && (
                <p className="text-white/60 text-xs">{currentUser.flat}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== "/dashboard/resident" && 
             item.href !== "/dashboard/committee" &&
             item.href !== "/dashboard/security" &&
             item.href !== "/dashboard/maintenance" &&
             item.href !== "/dashboard/vendor" &&
             item.href !== "/dashboard/builder" &&
             item.href !== "/dashboard/admin" &&
             location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-item ${
                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
              } ${!sidebarOpen ? "justify-center px-2" : ""}`}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              title={!sidebarOpen ? item.label : ""}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.label === "Visitor Entry" && unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-white/10 flex-shrink-0 space-y-0.5">
        <Link
          to="/"
          className={`sidebar-item sidebar-item-inactive ${!sidebarOpen ? "justify-center px-2" : ""}`}
          title={!sidebarOpen ? "Go to Website" : ""}
        >
          <Globe size={18} className="flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Back to Website</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full text-red-400 hover:bg-red-900/30 hover:text-red-300 ${
            !sidebarOpen ? "justify-center px-2" : ""
          }`}
          title={!sidebarOpen ? "Sign Out" : ""}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
