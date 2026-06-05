import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import heroBanner from "@/assets/hero-banner.jpg";
import { useAppStore } from "@/stores/appStore";
import {
  Shield,
  Zap,
  Users,
  BarChart3,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  TrendingUp,
  Bell,
  Calendar,
  CreditCard,
  Building2,
  MessageSquare,
  Wrench,
  MapPin,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Smart Visitor Management",
    description: "QR-based entry, pre-approvals, delivery tracking, and real-time visitor logs.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Wrench,
    title: "Maintenance & Complaints",
    description: "Raise, track, and resolve maintenance tickets with vendor assignment.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Automated bill generation, online payments, penalty management, and receipts.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Calendar,
    title: "Facility Booking",
    description: "Book clubhouse, gym, swimming pool, and courts in a few taps.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Community Engagement",
    description: "Announcements, polls, events, forums, and community feeds.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Society-level insights on finances, occupancy, maintenance, and engagement.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const stats = [
  { value: "500+", label: "Societies Managed" },
  { value: "2L+", label: "Happy Residents" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "AI Support" },
];

const testimonials = [
  {
    name: "Rajesh Mehta",
    role: "RWA President, Maple Heights Noida",
    quote: "MapleOne transformed our society management. Visitor approvals, billing, and complaint tracking — all in one place. Our residents love it.",
    rating: 5,
  },
  {
    name: "Priya Agarwal",
    role: "Resident, Green Valley Gurgaon",
    quote: "The QR entry system and real-time notifications give us peace of mind. Booking facilities and paying bills has never been easier.",
    rating: 5,
  },
  {
    name: "Sunil Kapoor",
    role: "Builder, Skyline Properties",
    quote: "Managing 3 societies from one dashboard with full analytics is a game changer. MapleOne is the future of property management.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹2,999",
    period: "/month",
    description: "Perfect for small societies",
    features: ["Up to 100 units", "Visitor management", "Basic billing", "Community feed", "Email support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "₹7,999",
    period: "/month",
    description: "Ideal for mid-sized communities",
    features: ["Up to 500 units", "All Starter features", "Facility booking", "Advanced analytics", "AI assistant", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large builders & portfolios",
    features: ["Unlimited units", "Multi-society management", "Custom integrations", "Dedicated manager", "White-label option", "SLA guarantee"],
    popular: false,
  },
];

const featureDetails: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  ctaText: string;
  badge: string;
}> = {
  "Smart Visitor Management": {
    title: "Smart Visitor Management",
    subtitle: "Complete Gate Control & Real-time Tracking",
    description: "Secure your community gates with standard-setting QR validation and instant digital approvals. Ensure every visitor, cab, or delivery is authenticated.",
    details: [
      "QR-based gate access codes for guests sent via WhatsApp/SMS.",
      "Real-time notifications sent to resident phones when delivery partners arrive.",
      "Pre-approved entry logs for staff, daily help, and repeating cabs.",
      "Security booths equipped with digital visitor registers and cameras.",
      "Overstay alerts and emergency gate-lock integrations."
    ],
    badge: "Visitor Safety",
    ctaText: "Explore Resident View"
  },
  "Maintenance & Complaints": {
    title: "Maintenance & Complaints",
    subtitle: "Seamless Issue Resolution & Tracking",
    description: "Say goodbye to paperwork. Lodge maintenance requests online, assign jobs to verified staff or vendors, and track status until resolution.",
    details: [
      "File complaints with photo attachments and priority tags.",
      "Automatic ticket routing to plumbers, electricians, or housekeeping.",
      "Direct chat channels between residents and assigned technicians.",
      "SLA breach warnings and escalation matrix for RWA administrators.",
      "Staff shift tracking and performance scorecard dashboards."
    ],
    badge: "Operations",
    ctaText: "Request Service Demo"
  },
  "Billing & Payments": {
    title: "Billing & Payments",
    subtitle: "Automated Ledger & Instant Inflow",
    description: "Automate society maintenance bill runs, collect securely via integrated payment gateways, and track receipts and penalty calculations.",
    details: [
      "Auto-generates bills on the 1st of every month with flat-wise splits.",
      "Secure payment processing via UPI, Credit Card, and Net Banking.",
      "Automated penalty/late fee accumulation rules.",
      "Real-time digital receipts sent instantly upon payment.",
      "Comprehensive RWA accounting reports and expense ledgers."
    ],
    badge: "Finance",
    ctaText: "Check Financials View"
  },
  "Facility Booking": {
    title: "Facility Booking",
    subtitle: "Effortless Clubhouse, Gym & Pool Schedules",
    description: "Rent or book society facilities within seconds. Prevent double bookings and manage slot-wise capacity parameters dynamically.",
    details: [
      "Check clubhouse, gym, and courts availability calendars.",
      "Dynamic hourly rate calculations and automated booking slots.",
      "RWA custom policy limits (e.g. max 2 hours per day per resident).",
      "Instant confirmation alerts and guest checklist slots.",
      "Cleanliness buffers scheduled automatically after slot expiry."
    ],
    badge: "Leisure",
    ctaText: "Book a Facility Now"
  },
  "Community Engagement": {
    title: "Community Engagement",
    subtitle: "Connect, Voice & Coordinate Together",
    description: "Engage your community with interactive polls, RWA announcements, dynamic forums, and organized festival events calendars.",
    details: [
      "Broadcast critical circulars and notices to all screens instantly.",
      "Run democratic society polls with encrypted user responses.",
      "Event ticketing registers and payment collections for festivals.",
      "Community forums to discuss society affairs and buy/sell items.",
      "RWA committee group calendars and meeting minutes archive."
    ],
    badge: "Social Hub",
    ctaText: "Go to Community Feed"
  },
  "Advanced Analytics": {
    title: "Advanced Analytics",
    subtitle: "RWA Decisions Backed by Clear Metrics",
    description: "Access builder and committee dashboards with custom graphs depicting financials, occupancy ratios, vendor SLAs, and tickets count.",
    details: [
      "Collection percentage trends and arrears tracking charts.",
      "Ticket resolution times and repeat complaint categories.",
      "Occupancy audits (Owner vs Tenant ratios and flat demographics).",
      "Resource usage audits (water tank levels, power backups).",
      "Custom audit reports exportable to PDF with single-click download."
    ],
    badge: "Data Room",
    ctaText: "View Analytics Demo"
  }
};

export default function HomePage() {
  const { isAuthenticated, currentUser } = useAppStore();
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<string | null>(null);

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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="MapleOne Society Management"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>

        <div className="relative page-container py-24">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">India's #1 Society Management Platform</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Society.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Reimagined.
              </span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              MapleOne brings together residents, committees, security, and vendors on one powerful AI-powered platform — making community living seamless, safe, and smart.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Visitor Management", "Smart Billing", "Facility Booking", "AI Assistant", "Real-time Security"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-white/90 text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardPath()} className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                    Go to Dashboard
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all font-semibold">
                    My Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                    Start Free Trial
                    <ArrowRight size={20} />
                  </Link>
                  <button className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all font-semibold">
                    <Play size={20} />
                    Watch Demo
                  </button>
                </>
              )}
            </div>

            <p className="text-white/50 text-sm">
              No credit card required · 30-day free trial · Setup in under 10 minutes
            </p>
          </div>

          {/* Floating Card */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-72 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm font-medium">Live Activity</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              {[
                { icon: MapPin, text: "Rahul Verma entered B-402", time: "Just now", color: "text-green-400" },
                { icon: Bell, text: "New announcement posted", time: "5 min ago", color: "text-yellow-400" },
                { icon: CreditCard, text: "₹5,800 bill generated", time: "1 hr ago", color: "text-blue-400" },
                { icon: Wrench, text: "Complaint #CMP-002 resolved", time: "2 hr ago", color: "text-purple-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs leading-snug">{item.text}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-border">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-4xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.value}
                </p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 bg-background">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Platform Overview</span>
            <h2 className="section-title mt-2 mb-4">Everything Your Society Needs</h2>
            <p className="text-muted-foreground text-lg">
              One comprehensive platform connecting every stakeholder in your residential community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                onClick={() => setSelectedFeatureInfo(f.title)}
                className="dashboard-card p-6 hover:-translate-y-1 transition-transform duration-200 group cursor-pointer"
              >
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                <div className="flex items-center gap-2 mt-4 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Details Modal */}
        {selectedFeatureInfo && (() => {
          const detail = featureDetails[selectedFeatureInfo];
          if (!detail) return null;
          return (
            <div className="modal-overlay" onClick={() => setSelectedFeatureInfo(null)}>
              <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-5 border-b border-border pb-4 pr-6">
                  <div>
                    <span className="text-primary text-xs font-bold uppercase bg-primary/10 px-3 py-1 rounded-full">{detail.badge}</span>
                    <h3 className="text-xl md:text-2xl font-bold mt-2 font-serif text-foreground">{detail.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium mt-0.5">{detail.subtitle}</p>
                  </div>
                  <button onClick={() => setSelectedFeatureInfo(null)} className="absolute top-6 right-6 w-8 h-8 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {detail.description}
                  </p>
                  <div className="space-y-3 bg-muted/40 p-4 md:p-5 rounded-2xl border border-border/50">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Key Functionalities Include:</p>
                    {detail.details.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="text-primary mt-1 font-bold">•</span>
                        <p className="leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setSelectedFeatureInfo(null)}
                      className="flex-1 btn-primary py-3 px-5 text-center font-bold rounded-xl text-sm"
                    >
                      {detail.ctaText}
                    </Link>
                    <button
                      onClick={() => setSelectedFeatureInfo(null)}
                      className="px-5 py-3 border border-border hover:bg-muted rounded-xl text-sm font-semibold text-muted-foreground transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Key Benefits */}
      <section className="py-20 gradient-hero text-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-red-300 text-sm font-semibold uppercase tracking-wider">Why MapleOne</span>
              <h2 className="section-title text-white">Built for Every Role in Your Community</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                MapleOne is designed with dedicated modules for each user role — ensuring everyone has exactly the tools they need.
              </p>

              {[
                { role: "Residents", desc: "Manage visitors, pay bills, book facilities, stay connected" },
                { role: "Committee Members", desc: "Oversee operations, manage finances, resolve complaints" },
                { role: "Security Guards", desc: "Digital visitor entry, QR verification, incident reporting" },
                { role: "Maintenance Staff", desc: "Ticket management, work orders, vendor coordination" },
                { role: "Builders & PMs", desc: "Portfolio analytics, occupancy tracking, community health" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold">{item.role}: </span>
                    <span className="text-white/70">{item.desc}</span>
                  </div>
                </div>
              ))}

              <Link to="/signup" className="inline-flex items-center gap-2 btn-primary px-8 py-4 mt-4">
                Get Started Today <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Multi-Role Access", value: "7 Roles" },
                { icon: Shield, label: "Visitor Logs", value: "Real-time" },
                { icon: TrendingUp, label: "Collection Rate", value: "94.3%" },
                { icon: Bell, label: "Response Time", value: "< 2 hrs" },
                { icon: Building2, label: "Communities", value: "500+" },
                { icon: Star, label: "App Rating", value: "4.8 ★" },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                  <item.icon size={24} className="mx-auto mb-2 text-white/70" />
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-white/60 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visitor Management Feature Highlight */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-3xl p-8 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base">Gate Entry Dashboard</span>
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Live</span>
                </div>
                {[
                  { name: "Rahul Verma", type: "Visitor", flat: "B-402", status: "Inside", color: "bg-green-100 text-green-700" },
                  { name: "Amazon Delivery", type: "Delivery", flat: "A-201", status: "Exited", color: "bg-gray-100 text-gray-600" },
                  { name: "Kavita Nair", type: "Visitor", flat: "B-402", status: "Pending", color: "bg-amber-100 text-amber-700" },
                ].map((v, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">{v.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.type} → {v.flat}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${v.color}`}>{v.status}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Inside Now", value: "4", color: "bg-green-100 text-green-700" },
                  { label: "Today's Entries", value: "28", color: "bg-blue-100 text-blue-700" },
                  { label: "Pending Approval", value: "2", color: "bg-amber-100 text-amber-700" },
                ].map((s, i) => (
                  <div key={i} className={`${s.color} rounded-xl p-3 text-center`}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Visitor Management</span>
              <h2 className="section-title">Complete Gate Security at Your Fingertips</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Pre-approve visitors from your phone, track all entries in real-time, and receive instant notifications when someone arrives.
              </p>
              {[
                "QR code-based visitor entry and verification",
                "Pre-approval system with approval/rejection",
                "Domestic staff and delivery tracking",
                "Vehicle entry management",
                "Complete visitor history and logs",
                "Instant push notifications on arrival",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-accent flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Feature Highlight */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Maintenance Management</span>
              <h2 className="section-title">From Issue to Resolution, Tracked Every Step</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Residents raise complaints in seconds, tickets are auto-assigned to staff or vendors, and everyone stays updated in real-time.
              </p>
              {[
                "Instant complaint registration with photos",
                "Automatic priority assignment",
                "Real-time status tracking",
                "Vendor assignment and scheduling",
                "Post-resolution feedback system",
                "SLA tracking and escalation alerts",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-accent flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">Active Tickets</span>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">5 Open</span>
                </div>
                {[
                  { title: "Lift Not Working – Tower C", priority: "Urgent", status: "Open", color: "border-l-red-500" },
                  { title: "Water Leakage – B-402", priority: "High", status: "In Progress", color: "border-l-amber-500" },
                  { title: "Pool Maintenance", priority: "High", status: "In Progress", color: "border-l-amber-500" },
                  { title: "Parking Lighting", priority: "Medium", status: "Resolved", color: "border-l-green-500" },
                ].map((t, i) => (
                  <div key={i} className={`border-l-4 ${t.color} pl-3 py-2 mb-2 last:mb-0`}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{t.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        t.status === "Resolved" ? "bg-green-100 text-green-700" :
                        t.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                        "bg-red-100 text-red-700"
                      }`}>{t.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Priority: {t.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Engagement */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Community Engagement</span>
            <h2 className="section-title mt-2 mb-4">Build a Thriving Community Together</h2>
            <p className="text-muted-foreground text-lg">
              Keep residents connected, informed, and engaged with powerful community tools.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Announcements & News",
                desc: "Committee posts reach all residents instantly with priority flagging.",
                icon: Bell,
                bg: "bg-amber-50",
                color: "text-amber-600",
              },
              {
                title: "Polls & Surveys",
                desc: "Make community decisions democratically with digital voting.",
                icon: BarChart3,
                bg: "bg-blue-50",
                color: "text-blue-600",
              },
              {
                title: "Events & Activities",
                desc: "Organize and register for society events, festivals, and activities.",
                icon: Calendar,
                bg: "bg-green-50",
                color: "text-green-600",
              },
            ].map((item, i) => (
              <div key={i} className="dashboard-card p-6 text-center hover:-translate-y-1 transition-transform">
                <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="section-title mt-2 mb-4">Trusted by Communities Across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="dashboard-card p-6 space-y-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-10 h-10 gradient-maple rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Pricing</span>
            <h2 className="section-title mt-2 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">No hidden fees. Scale as your community grows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative dashboard-card p-8 ${plan.popular ? "ring-2 ring-primary shadow-primary/20 shadow-xl !overflow-visible" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-maple text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? getDashboardPath() : (plan.name === "Enterprise" ? "/contact" : "/signup")}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "btn-primary"
                      : "border-2 border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {isAuthenticated ? "Go to Dashboard" : (plan.name === "Enterprise" ? "Contact Sales" : "Get Started")}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="text-primary font-medium hover:underline flex items-center gap-1 justify-center">
              View full pricing details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-maple text-white">
        <div className="page-container text-center space-y-8">
          <h2 className="section-title text-white max-w-3xl mx-auto">
            Ready to Transform Your Society Management?
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Join 500+ communities already using MapleOne. Setup takes less than 10 minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all text-base">
                  Go to Dashboard
                </Link>
                <Link to="/profile" className="px-10 py-4 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-base">
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all text-base">
                  Start Free Trial — 30 Days
                </Link>
                <Link to="/contact" className="px-10 py-4 border-2 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-base">
                  Schedule a Demo
                </Link>
              </>
            )}
          </div>
          <p className="text-white/50 text-sm">No credit card · No commitment · Cancel anytime</p>
        </div>
      </section>
    </PublicLayout>
  );
}
