import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { mockUsers } from "@/constants/mockData";
import type { UserRole } from "@/types";
import PublicLayout from "@/components/layout/PublicLayout";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";

const roleOptions: { value: UserRole; label: string; desc: string }[] = [
  { value: "resident", label: "Resident", desc: "Manage your flat, visitors & bills" },
  { value: "committee", label: "Committee Member", desc: "Society administration & finance" },
  { value: "security", label: "Security Guard", desc: "Visitor entry & gate management" },
  { value: "maintenance", label: "Maintenance Staff", desc: "Work orders & ticket management" },
  { value: "vendor", label: "Vendor / Service", desc: "Service requests & bookings" },
  { value: "builder", label: "Builder / PM", desc: "Property portfolio & analytics" },
  { value: "admin", label: "Super Admin", desc: "Full platform administration" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, currentUser, users } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(rolePaths[currentUser.role as UserRole] || "/dashboard/resident");
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Auto pre-fill demo credentials on role change
  useEffect(() => {
    const user = users.find((u) => u.role === selectedRole);
    if (user) {
      setEmail(user.email);
      setPassword("password123");
    }
  }, [selectedRole, users]);

  const rolePaths: Record<UserRole, string> = {
    resident: "/dashboard/resident",
    committee: "/dashboard/committee",
    security: "/dashboard/security",
    maintenance: "/dashboard/maintenance",
    vendor: "/dashboard/vendor",
    builder: "/dashboard/builder",
    admin: "/dashboard/admin",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate login delay
    setTimeout(() => {
      const user = users.find((u) => u.role === selectedRole);
      if (user) {
        if (user.status === "Blocked") {
          setError("Your account has been blocked by the Super Admin.");
          setLoading(false);
          return;
        }
        login(user);
        navigate(rolePaths[selectedRole]);
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
          <div className="text-white max-w-md space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Welcome Back to MapleOne
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Your premium society management platform. Sign in to access your personalized dashboard.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Manage visitors & security in real-time",
                "Pay bills and track maintenance effortlessly",
                "Stay connected with your community",
                "AI-powered insights and assistance",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
              <p className="text-white/70 text-sm italic">
                "MapleOne has completely changed how our society operates. The visitor management alone saves us hours every day."
              </p>
              <p className="text-white font-semibold text-sm mt-3">— Priya Mehta, RWA President</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-6 bg-background">
          <div className="w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 gradient-maple rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">M1</span>
                </div>
                <span className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <span className="text-primary">Maple</span><span className="text-secondary">One</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Sign in to your account</h1>
              <p className="text-muted-foreground text-sm mt-1">Select your role and enter your credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Sign in as</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        selectedRole === role.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className={`font-semibold text-xs ${selectedRole === role.value ? "text-primary" : "text-foreground"}`}>
                        {role.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-amber-800 text-xs font-medium">
                  Demo Mode: Any email/password works. Select your role and click Sign In.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to MapleOne
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                New to MapleOne?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Create free account <ArrowRight size={14} className="inline" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
