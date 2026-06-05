import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { mockUsers } from "@/constants/mockData";
import type { UserRole } from "@/types";
import PublicLayout from "@/components/layout/PublicLayout";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "resident", label: "Resident / Owner / Tenant" },
  { value: "committee", label: "Society Committee Member" },
  { value: "security", label: "Security Personnel" },
  { value: "maintenance", label: "Maintenance Staff" },
  { value: "vendor", label: "Vendor / Service Provider" },
  { value: "builder", label: "Builder / Property Manager" },
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("resident");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    society: "",
    flat: "",
    tower: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, currentUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      navigate(rolePaths[currentUser.role as UserRole] || "/dashboard/resident");
    }
  }, [isAuthenticated, currentUser, navigate]);

  const rolePaths: Record<UserRole, string> = {
    resident: "/dashboard/resident",
    committee: "/dashboard/committee",
    security: "/dashboard/security",
    maintenance: "/dashboard/maintenance",
    vendor: "/dashboard/vendor",
    builder: "/dashboard/builder",
    admin: "/dashboard/admin",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => {
      const user = mockUsers[selectedRole];
      if (user) {
        login({ ...user, name: formData.name || user.name, email: formData.email || user.email });
        navigate(rolePaths[selectedRole]);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-maple rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">M1</span>
              </div>
              <span className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-primary">Maple</span><span className="text-secondary">One</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold">Create your MapleOne account</h1>
            <p className="text-muted-foreground text-sm mt-1">30-day free trial · No credit card required</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  step > s ? "bg-accent text-white" : step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <CheckCircle size={16} /> : s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Your Details" : "Society Info"}
                </span>
                {s < 2 && <div className="flex-1 h-px bg-border" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-5 shadow-sm">
            {step === 1 ? (
              <>
                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                          selectedRole === role.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="input-field"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Create Password *</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="input-field pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Society / Community Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.society}
                    onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                    placeholder="e.g. Maple Heights"
                    className="input-field"
                  />
                </div>
                {(selectedRole === "resident" || selectedRole === "committee") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Tower / Block</label>
                      <input
                        type="text"
                        value={formData.tower}
                        onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                        placeholder="e.g. Tower B"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Flat / Unit No.</label>
                      <input
                        type="text"
                        value={formData.flat}
                        onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
                        placeholder="e.g. B-402"
                        className="input-field"
                      />
                    </div>
                  </div>
                )}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  <p className="text-green-800 text-xs font-medium">
                    ✓ Demo Mode Active: Your account will be instantly created. No verification required.
                  </p>
                </div>
              </>
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
                  <UserPlus size={18} />
                  {step === 1 ? "Continue" : "Create My Account"}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
