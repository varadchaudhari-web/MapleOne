import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import {
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Home,
  Zap,
  Layers,
  DollarSign,
  Info,
  Phone,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/features", icon: Zap },
  { label: "Solutions", href: "/solutions", icon: Layers },
  { label: "Pricing", href: "/pricing", icon: DollarSign },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

export default function PublicNavbar() {
  const { currentUser, isAuthenticated, logout, notifications } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    const rolePaths: Record<string, string> = {
      resident: "/dashboard/resident",
      committee: "/dashboard/committee",
      security: "/dashboard/security",
      maintenance: "/dashboard/maintenance",
      vendor: "/dashboard/vendor",
      builder: "/dashboard/builder",
      admin: "/dashboard/admin",
    };
    return rolePaths[currentUser.role] || "/dashboard/resident";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 gradient-maple rounded-lg flex items-center justify-center shadow-primary">
              <span className="text-white font-bold text-sm">M1</span>
            </div>
            <span className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-primary">Maple</span>
              <span className="text-secondary">One</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <>
                {/* Notifications */}
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="relative p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <Bell size={20} className="text-foreground/70" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-8 h-8 gradient-maple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold leading-none">{currentUser.name.split(" ")[0]}</p>
                      <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden animate-fade-in">
                      <div className="p-4 border-b border-border bg-muted/30">
                        <p className="font-semibold text-sm">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium capitalize">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} className="text-primary" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-muted transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User size={16} className="text-primary" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-red-50 text-red-600 transition-colors w-full text-left mt-1"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-colors">
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-lg animate-fade-in">
          <div className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:bg-muted"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary/10 text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-center border border-border hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-center gradient-maple text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
