import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
import { User, Shield, Key, CheckCircle, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { currentUser, isAuthenticated, addNotification } = useAppStore();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || "User");
  const [email, setEmail] = useState(currentUser?.email || "user@mapleone.com");
  const [phone, setPhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [success, setSuccess] = useState(false);

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

  if (!isAuthenticated || !currentUser) {
    return (
      <PublicLayout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold">Please log in to view this page.</h2>
          <Link to="/login" className="btn-primary mt-4 inline-block">Log In</Link>
        </div>
      </PublicLayout>
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    addNotification({
      id: `notif_${Date.now()}`,
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString(),
      category: "System",
    });
  };

  const insideDashboard = window.location.pathname.startsWith("/dashboard");

  const Content = (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your MapleOne profile settings and security details.</p>
        </div>
        {!insideDashboard && (
          <Link to={getDashboardPath()} className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side Info */}
        <div className="dashboard-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 gradient-maple rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{currentUser.name}</h3>
            <p className="text-muted-foreground text-sm capitalize">{currentUser.role}</p>
            {currentUser.flat && (
              <p className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full inline-block mt-2 font-medium">
                Unit {currentUser.flat}
              </p>
            )}
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Personal Profile
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase block mb-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Save Changes
              </button>

              {success && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-2 animate-fade-in">
                  <CheckCircle size={16} />
                  Profile updated successfully!
                </div>
              )}
            </form>
          </div>

          <div className="dashboard-card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Key size={18} className="text-primary" />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div>
                  <p className="font-semibold text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Keep your account extra secure with a verification code.</p>
                </div>
                <button className="text-xs font-semibold text-primary hover:underline">Enable</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <div>
                  <p className="font-semibold text-sm">Reset Password</p>
                  <p className="text-xs text-muted-foreground">Change your password to a new, secure one.</p>
                </div>
                <button className="text-xs font-semibold text-primary hover:underline">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return insideDashboard ? (
    <DashboardLayout title="My Profile">{Content}</DashboardLayout>
  ) : (
    <PublicLayout>{Content}</PublicLayout>
  );
}
