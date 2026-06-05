import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Zap, Shield, Users, BarChart3, Calendar, CreditCard, MessageSquare, Wrench, Brain, Globe, CheckCircle } from "lucide-react";

const features = [
  {
    category: "Visitor & Security",
    icon: Shield,
    color: "bg-red-50 text-red-600",
    items: [
      "QR Code Visitor Entry System",
      "Pre-approval Visitor Requests",
      "Real-time Entry/Exit Logs",
      "Vehicle Number Plate Tracking",
      "Domestic Staff Management",
      "Delivery Package Tracking",
      "Emergency SOS Alerts",
      "Incident Reporting",
    ],
  },
  {
    category: "Resident Management",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    items: [
      "Resident Onboarding & KYC",
      "Family Member Profiles",
      "Owner vs Tenant Management",
      "Multi-Property Support",
      "Resident Directory",
      "Move-In / Move-Out Process",
      "Digital Document Storage",
      "Society Role Management",
    ],
  },
  {
    category: "Billing & Finance",
    icon: CreditCard,
    color: "bg-green-50 text-green-600",
    items: [
      "Automated Bill Generation",
      "Online Payment Integration",
      "Due & Penalty Tracking",
      "Expense Management",
      "Financial Reports & Ledger",
      "GST-compliant Invoices",
      "Payment Reminder Automation",
      "Fund Collection Analytics",
    ],
  },
  {
    category: "Maintenance & Complaints",
    icon: Wrench,
    color: "bg-amber-50 text-amber-600",
    items: [
      "Complaint Registration with Photos",
      "Auto-Priority Assignment",
      "Ticket Status Tracking",
      "Vendor Assignment System",
      "Work Order Management",
      "SLA Monitoring & Alerts",
      "Feedback & Rating System",
      "Maintenance History",
    ],
  },
  {
    category: "Facility Management",
    icon: Calendar,
    color: "bg-purple-50 text-purple-600",
    items: [
      "Clubhouse Booking",
      "Swimming Pool Reservations",
      "Gym Slot Management",
      "Badminton / Tennis Courts",
      "Community Hall Booking",
      "Guest Room Reservations",
      "Online Payment for Booking",
      "Availability Calendar",
    ],
  },
  {
    category: "Community Engagement",
    icon: MessageSquare,
    color: "bg-teal-50 text-teal-600",
    items: [
      "Community Announcements",
      "Discussion Forums",
      "Digital Polling System",
      "Event Organization & RSVP",
      "Resident Groups & Channels",
      "Classified Ads Board",
      "Lost & Found",
      "Neighborhood News Feed",
    ],
  },
  {
    category: "Analytics & Reports",
    icon: BarChart3,
    color: "bg-indigo-50 text-indigo-600",
    items: [
      "Financial Health Dashboard",
      "Maintenance Performance Reports",
      "Facility Utilization Analytics",
      "Security Insights & Trends",
      "Resident Engagement Metrics",
      "Community Health Score",
      "Custom Report Builder",
      "Exportable PDF/Excel Reports",
    ],
  },
  {
    category: "AI-Powered Features",
    icon: Brain,
    color: "bg-pink-50 text-pink-600",
    items: [
      "AI Community Assistant Chatbot",
      "Smart Maintenance Guidance",
      "Automated Announcements",
      "Predictive Issue Detection",
      "Intelligent Vendor Matching",
      "Natural Language Search",
      "FAQ Automation",
      "AI-driven Recommendations",
    ],
  },
];

export default function FeaturesPage() {
  const { isAuthenticated, currentUser } = useAppStore();

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
    <PublicLayout>
      {/* Hero */}
      <section className="py-20 gradient-hero text-white">
        <div className="page-container text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium">
            <Zap size={16} />
            Complete Feature Suite
          </span>
          <h1 className="section-title text-white max-w-3xl mx-auto">
            Every Feature Your Community Needs
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            MapleOne brings together 100+ features across 8 modules, purpose-built for modern residential communities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all">
                Start Free Trial
              </Link>
            )}
            <Link to="/pricing" className="px-8 py-4 border-2 border-white/40 text-white rounded-xl hover:bg-white/10 transition-all font-semibold">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-border">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "100+", label: "Features" },
              { value: "8", label: "Core Modules" },
              { value: "7", label: "User Roles" },
              { value: "24/7", label: "AI Support" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Modules */}
      <section className="py-20 bg-background">
        <div className="page-container space-y-16">
          {features.map((module, i) => (
            <div key={i} className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="space-y-4">
                <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center`}>
                  <module.icon size={26} />
                </div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{module.category}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Comprehensive {module.category.toLowerCase()} capabilities built for residential communities of all sizes.
                </p>
                <Link
                  to={isAuthenticated ? getDashboardPath() : "/signup"}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                >
                  {isAuthenticated ? "Go to Dashboard →" : `Explore ${module.category} →`}
                </Link>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {module.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <CheckCircle size={16} className="text-accent flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Globe size={40} className="mx-auto text-primary mb-4" />
            <h2 className="section-title mb-3">Works With Your Existing Systems</h2>
            <p className="text-muted-foreground">MapleOne integrates seamlessly with payment gateways, SMS services, CCTV systems, and more.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {["Razorpay", "PayU", "CCAvenue", "Google Pay", "HDFC NetBanking", "Twilio SMS", "Firebase Notifications", "CCTV API", "WhatsApp Business"].map((item) => (
              <span key={item} className="px-4 py-2 bg-muted rounded-full text-sm font-medium border border-border">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-maple text-white">
        <div className="page-container text-center space-y-6">
          <h2 className="section-title text-white">Ready to Experience All These Features?</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Start your free 30-day trial and unlock every feature for your community.
          </p>
          <Link
            to={isAuthenticated ? getDashboardPath() : "/signup"}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all text-base"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
