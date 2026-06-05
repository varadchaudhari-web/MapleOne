import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Users, Target, Award, Heart } from "lucide-react";

const team = [
  { name: "Arun Mehta", role: "CEO & Co-Founder", bg: "from-red-500 to-red-700" },
  { name: "Divya Kapoor", role: "CTO & Co-Founder", bg: "from-blue-500 to-blue-700" },
  { name: "Rohit Sharma", role: "VP Product", bg: "from-green-500 to-green-700" },
  { name: "Priyanka Nair", role: "VP Sales", bg: "from-purple-500 to-purple-700" },
  { name: "Arjun Patel", role: "Head of Engineering", bg: "from-amber-500 to-amber-700" },
  { name: "Sunita Rao", role: "Head of Customer Success", bg: "from-teal-500 to-teal-700" },
];

const milestones = [
  { year: "2019", title: "Founded in Noida", desc: "MapleOne was founded by ex-MyGate engineers with a vision to build India's most complete society management platform." },
  { year: "2020", title: "First 50 Societies", desc: "Launched beta with 50 pilot societies in Delhi-NCR. Achieved 95% satisfaction rate in the first year." },
  { year: "2021", title: "Series A Funding", desc: "Raised ₹25 Cr Series A. Expanded to Mumbai, Bangalore, and Pune. Launched mobile apps." },
  { year: "2022", title: "500 Communities Milestone", desc: "Crossed 500 active communities and 1 lakh residents. Introduced AI Assistant and analytics module." },
  { year: "2023", title: "Multi-city Expansion", desc: "Expanded to 15 cities across India. Launched Builder Portfolio and Vendor Marketplace modules." },
  { year: "2025", title: "The Next Chapter", desc: "2+ lakh residents, 500+ societies, and India's most trusted society management platform." },
];

export default function AboutPage() {
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
      <section className="py-24 gradient-hero text-white">
        <div className="page-container text-center space-y-6 max-w-3xl mx-auto">
          <span className="text-red-300 text-sm font-semibold uppercase tracking-wider">Our Story</span>
          <h1 className="section-title text-white">Built by Residents, for Residents</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            MapleOne was born from frustration — the co-founders lived in poorly managed apartments and decided to build the platform they always wished existed.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-5">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <Target size={26} />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To make community living seamless, safe, and smart by empowering residents, committees, and service providers with technology that actually works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe every Indian deserves to live in a well-managed community where bills are transparent, visitors are tracked, and the committee is accountable. MapleOne makes this a reality.
              </p>
            </div>
            <div className="space-y-5">
              <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                <Heart size={26} />
              </div>
              <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Values</h2>
              <div className="space-y-3">
                {[
                  { title: "Transparency First", desc: "Every transaction, every decision — auditable and open." },
                  { title: "Community-Centered", desc: "We build what communities actually need, not what looks good on paper." },
                  { title: "Security Always", desc: "Your data and your family's safety are non-negotiable." },
                  { title: "Continuous Innovation", desc: "We ship features every week based on real community feedback." },
                ].map((v, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <span className="font-semibold">{v.title}: </span>
                      <span className="text-muted-foreground text-sm">{v.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: "2019", label: "Founded" },
              { value: "500+", label: "Communities" },
              { value: "2L+", label: "Residents" },
              { value: "15+", label: "Cities" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-border">
                <p className="text-4xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="page-container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Award size={40} className="mx-auto text-primary mb-4" />
            <h2 className="section-title mb-3">Our Journey</h2>
            <p className="text-muted-foreground">From a small Noida startup to India's leading society management platform.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex gap-6 pl-16">
                  <div className="absolute left-4 top-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 -translate-x-1/2">
                    {i + 1}
                  </div>
                  <div className="flex-1 dashboard-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-bold text-lg">{m.year}</span>
                      <h3 className="font-bold">{m.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="page-container">
          <div className="text-center mb-12">
            <Users size={40} className="mx-auto text-primary mb-4" />
            <h2 className="section-title mb-3">Our Leadership Team</h2>
            <p className="text-muted-foreground">The people building the future of community living.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((member, i) => (
              <div key={i} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${member.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-xl">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-maple text-white">
        <div className="page-container text-center space-y-6">
          <h2 className="section-title text-white">Join the MapleOne Community</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to={getDashboardPath()} className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/signup" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all">
                Start Free Trial
              </Link>
            )}
            <Link to="/careers" className="px-8 py-4 border-2 border-white/50 text-white rounded-xl hover:bg-white/10 transition-all font-semibold">
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
