import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Building2, Home, Shield, Wrench, Store, Users, CheckCircle, ArrowRight } from "lucide-react";

const solutions = [
  {
    id: "residential",
    icon: Home,
    title: "Residential Societies",
    subtitle: "Apartments, Condominiums & Housing Complexes",
    description: "Complete end-to-end management for residential apartment complexes, housing societies, and condominiums with gated community features.",
    keyFeatures: [
      "Multi-tower resident management",
      "Automated monthly billing & collections",
      "Smart visitor & gate management",
      "Community events & announcements",
      "Online facility reservations",
      "Society election & polling system",
    ],
    stats: { value: "350+", label: "Residential Societies" },
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
  },
  {
    id: "gated",
    icon: Shield,
    title: "Gated Communities",
    subtitle: "High-Security Premium Enclaves",
    description: "Enterprise-grade security management for gated communities requiring multi-layer access control, CCTV integration, and real-time monitoring.",
    keyFeatures: [
      "Multi-gate entry management",
      "QR & RFID access control",
      "CCTV integration dashboard",
      "Staff attendance tracking",
      "Emergency SOS & response",
      "VIP visitor management",
    ],
    stats: { value: "80+", label: "Gated Communities" },
    color: "from-red-500 to-red-700",
    bg: "bg-red-50",
  },
  {
    id: "builder",
    icon: Building2,
    title: "Builders & Developers",
    subtitle: "Property Portfolio Management",
    description: "Manage multiple properties from one unified dashboard. Track occupancy, monitor community health, and analyze operations across your entire portfolio.",
    keyFeatures: [
      "Multi-society portfolio view",
      "Occupancy & vacancy tracking",
      "Construction phase handover",
      "Resident onboarding workflow",
      "Financial health monitoring",
      "Brand-consistent white-label option",
    ],
    stats: { value: "50+", label: "Builder Portfolios" },
    color: "from-amber-500 to-amber-700",
    bg: "bg-amber-50",
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Maintenance Companies",
    subtitle: "Professional Facility Management",
    description: "Specialized tools for AMC companies and facility management firms to handle work orders, vendor coordination, and SLA compliance.",
    keyFeatures: [
      "Ticket & work order management",
      "Vendor assignment & tracking",
      "SLA monitoring & escalation",
      "Preventive maintenance schedules",
      "Cost estimation & billing",
      "Performance analytics",
    ],
    stats: { value: "120+", label: "Maintenance Partners" },
    color: "from-green-500 to-green-700",
    bg: "bg-green-50",
  },
  {
    id: "vendors",
    icon: Store,
    title: "Vendors & Service Providers",
    subtitle: "Local Services Marketplace",
    description: "Connect your services directly with society residents. Manage requests, track jobs, collect payments, and build your reputation.",
    keyFeatures: [
      "Service catalog management",
      "Booking & scheduling system",
      "Digital payments & invoicing",
      "Customer rating & reviews",
      "Business analytics dashboard",
      "Multi-society service reach",
    ],
    stats: { value: "500+", label: "Registered Vendors" },
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-50",
  },
  {
    id: "rwa",
    icon: Users,
    title: "RWA & Committee",
    subtitle: "Resident Welfare Associations",
    description: "Empower your elected committee with digital tools for transparent governance, financial management, and resident communication.",
    keyFeatures: [
      "Complaint & resolution tracking",
      "Financial ledger & audit trail",
      "Democratic polling system",
      "Committee meeting management",
      "Announcement & notice board",
      "Annual report generation",
    ],
    stats: { value: "500+", label: "Active RWAs" },
    color: "from-teal-500 to-teal-700",
    bg: "bg-teal-50",
  },
];

export default function SolutionsPage() {
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
      <section className="py-20 bg-gradient-to-br from-slate-900 to-maple-dark text-white">
        <div className="page-container text-center space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-sm font-medium">
            Tailored For Every Community Type
          </span>
          <h1 className="section-title text-white max-w-3xl mx-auto">
            Purpose-Built Solutions for Every Community
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you manage a 50-unit housing society or a 2,000-unit township, MapleOne has the right solution for you.
          </p>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-background">
        <div className="page-container space-y-20">
          {solutions.map((sol, i) => (
            <div
              key={sol.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
            >
              <div className={`space-y-6 ${i % 2 === 1 ? "lg:col-start-2" : ""}`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${sol.color} rounded-2xl flex items-center justify-center`}>
                  <sol.icon size={30} className="text-white" />
                </div>
                <div>
                  <span className="text-primary text-sm font-semibold uppercase tracking-wider">{sol.subtitle}</span>
                  <h2 className="text-3xl font-bold mt-1 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{sol.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{sol.description}</p>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {sol.keyFeatures.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? getDashboardPath() : "/signup"}
                  className="inline-flex items-center gap-2 btn-primary px-8 py-3"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight size={16} />
                </Link>
              </div>

              <div className={`${i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                <div className={`${sol.bg} rounded-3xl p-8 space-y-4`}>
                  <div className="bg-white rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">{sol.title}</h3>
                      <span className={`px-3 py-1 bg-gradient-to-r ${sol.color} text-white text-xs rounded-full font-semibold`}>
                        {sol.stats.value}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{sol.stats.label} using this solution</p>
                    <div className="grid grid-cols-3 gap-3">
                      {["Residents", "Security", "Finance"].map((metric) => (
                        <div key={metric} className={`${sol.bg} rounded-xl p-3 text-center`}>
                          <p className="font-bold text-sm">Active</p>
                          <p className="text-xs text-muted-foreground">{metric}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {sol.keyFeatures.slice(0, 4).map((f, j) => (
                      <div key={j} className="bg-white rounded-xl p-3 border border-white shadow-sm">
                        <p className="text-xs font-medium leading-tight">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-maple text-white">
        <div className="page-container text-center space-y-6">
          <h2 className="section-title text-white">Find the Right Plan for Your Community</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/pricing" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all">
              View All Plans
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white/50 text-white rounded-xl hover:bg-white/10 transition-all font-semibold">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
