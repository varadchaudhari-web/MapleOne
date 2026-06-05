import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import {
  Zap,
  Book,
  Code,
  Play,
  FileText,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Users,
  Building,
  DollarSign,
  Briefcase,
  HelpCircle,
  Video,
  MessageSquare,
  Lock,
  Download
} from "lucide-react";

// Helper for dynamic dashboard path mapping
function useDashboardPath() {
  const { currentUser } = useAppStore();
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
}

// Global Auth CTA component to display correct buttons based on state
function AuthCTASection({
  title = "Ready to experience MapleOne?",
  subtitle = "Join 500+ communities already using our platform."
}) {
  const { isAuthenticated } = useAppStore();
  const dashPath = useDashboardPath();

  return (
    <section className="py-16 bg-muted/50 border-t border-border">
      <div className="page-container text-center max-w-4xl space-y-6">
        <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">{subtitle}</p>
        <div className="flex gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to={dashPath} className="btn-primary px-6 py-2.5 text-sm">
                Go to Dashboard
              </Link>
              <Link to="/profile" className="px-6 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors">
                View Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn-primary px-6 py-2.5 text-sm">
                Get Started
              </Link>
              <Link to="/login" className="px-6 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted transition-colors">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// 1. CHANGELOG PAGE
export function ChangelogPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Updates
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Product Changelog</h1>
          <p className="text-white/80 text-sm max-w-md">Stay up to date with the latest features, improvements, and fixes on the MapleOne platform.</p>
        </div>
      </section>

      {/* Section 2: Release Highlights */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Recent Release Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="dashboard-card p-5 border border-primary/20 bg-primary/5">
              <span className="text-xs font-bold text-primary uppercase">v2.4.0 Major Release</span>
              <h3 className="font-bold mt-2">AI Resident Assistant</h3>
              <p className="text-muted-foreground text-xs mt-1">Full chatbot integration handling facility policies, vendor details, and society FAQs.</p>
            </div>
            <div className="dashboard-card p-5">
              <span className="text-xs font-bold text-accent uppercase">v2.3.5 Feature Update</span>
              <h3 className="font-bold mt-2">Custom PDF Generation</h3>
              <p className="text-muted-foreground text-xs mt-1">Download real, signed receipts and invoices for maintenance fees and visitor passes instantly.</p>
            </div>
            <div className="dashboard-card p-5">
              <span className="text-xs font-bold text-green-600 uppercase">v2.3.0 Security Fix</span>
              <h3 className="font-bold mt-2">Vehicle Entry Management</h3>
              <p className="text-muted-foreground text-xs mt-1">Introduced automatic license plate logs and guest QR codes verified at gate terminals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Detailed Changes */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-8">
          <h2 className="text-xl font-bold">Detailed Version Logs</h2>
          {[
            {
              version: "v2.4.0", date: "May 15, 2025", type: "Major",
              items: ["AI Community Assistant powered by GPT-4", "New vendor marketplace with reviews and ratings", "PDF report generation using jsPDF engine", "Multi-society builder dashboard and reporting portal"]
            },
            {
              version: "v2.3.0", date: "Apr 1, 2025", type: "Minor",
              items: ["Facility booking QR scanner verification", "Enhanced real-time push notification system", "Committee financials and ledger configuration", "Mobile responsiveness optimizations"]
            },
            {
              version: "v2.2.5", date: "Mar 10, 2025", type: "Patch",
              items: ["Fixed bill receipt downloading crash", "Improved visitor approval prompt flows", "Gate security terminal logs auto-refreshing", "Minor bug fixes for user onboarding state"]
            }
          ].map((log) => (
            <div key={log.version} className="dashboard-card p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-primary">{log.version}</span>
                <span className="px-2 py-0.5 bg-muted rounded-full text-xs font-medium text-muted-foreground">{log.type}</span>
                <span className="text-xs text-muted-foreground ml-auto">{log.date}</span>
              </div>
              <ul className="space-y-2">
                {log.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/85">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Want to experience the latest features?"
        subtitle="Log in or create a demo account to access all features in real time."
      />
    </PublicLayout>
  );
}

// 2. ROADMAP PAGE
export function RoadmapPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Future
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Product Roadmap</h1>
          <p className="text-white/80 text-sm max-w-md">See what we are planning, building, and launching next to streamline residential living.</p>
        </div>
      </section>

      {/* Section 2: Future Pillars */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Strategic Product Pillars</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Automation", desc: "Automating billing penalties, auto-assigning complaints to nearest certified plumbers/electricians." },
              { icon: Users, title: "Engagement", desc: "Digital society voting, hybrid resident polls, and advanced neighborhood social groups." },
              { icon: Lock, title: "Security", desc: "Hardware integrations with RFID barrier gates, biometric sensors, and license plate cams." },
              { icon: DollarSign, title: "Financials", desc: "UPI auto-debits, GST ledger reports, and dynamic society auditing mechanisms." }
            ].map((p, idx) => (
              <div key={idx} className="dashboard-card p-5 border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <p.icon size={20} />
                </div>
                <h3 className="font-bold text-sm">{p.title}</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Timeline */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold mb-4">Launch Timeline</h2>
          <div className="space-y-6">
            {[
              { phase: "Q2 2025", status: "In Development", items: ["WhatsApp chatbot alerts for deliveries", "Electric Vehicle (EV) charger slot reservation module", "Biometric visitor check-in sync API"] },
              { phase: "Q3 2025", status: "Planned", items: ["Complete mobile application rebuild v2.0", "Committee legal compliance document checklist generator", "Integrated SOS call-back loop for guards"] },
              { phase: "Q4 2025", status: "Conceptual", items: ["Predictive AI energy auditing software", "Automated society gate cameras (ANPR) API support", "Multi-lingual dashboard options"] }
            ].map((term) => (
              <div key={term.phase} className="dashboard-card p-6 flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/4">
                  <span className="font-bold text-lg text-primary">{term.phase}</span>
                  <p className="text-xs font-semibold text-accent mt-0.5">{term.status}</p>
                </div>
                <div className="md:w-3/4">
                  <ul className="space-y-2">
                    {term.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-primary text-xs">🚀</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Have feature requests?"
        subtitle="Log in to submit a ticket to the RWA feedback board."
      />
    </PublicLayout>
  );
}

// 3. DOCUMENTATION
export function DocsPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Resources
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Help & Documentation</h1>
          <p className="text-white/80 text-sm max-w-md font-light">Detailed user guides, configuration manuals, and troubleshooting docs for MapleOne.</p>
        </div>
      </section>

      {/* Section 2: Quick Start */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Quick Start Pathways</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="dashboard-card p-5 border border-border">
              <h3 className="font-bold text-base text-primary">Resident Guide</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                Learn how to invite guests, pay society bills via dynamic gateway, raise tickets, and book amenities instantly.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold mt-4 hover:underline">
                Read Resident Docs <ArrowRight size={12} />
              </Link>
            </div>
            <div className="dashboard-card p-5 border border-border">
              <h3 className="font-bold text-base text-primary">RWA Committee Guide</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                Step-by-step setup guides to configure RWA bank accounts, configure fees, assign vendor catalogs, and review complaints.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold mt-4 hover:underline">
                Read Committee Docs <ArrowRight size={12} />
              </Link>
            </div>
            <div className="dashboard-card p-5 border border-border">
              <h3 className="font-bold text-base text-primary">Security Setup</h3>
              <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                Step-by-step guide for gatekeepers on checking-in visitors with QR scanner, license plate matching, and recording incident briefs.
              </p>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold mt-4 hover:underline">
                Read Gatekeeper Docs <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Categories Grid */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold mb-4">Browse Documentation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Resident Account Setup", topics: ["Verifying Flat Identity", "Updating Family Profiles", "Setting up UPI Auto-debits"] },
              { title: "Visitor Pass Policies", topics: ["QR Code Expiration", "Delivery Pre-Approvals", "Staff Attendance Records"] },
              { title: "Amenities Management", topics: ["Setting Slots Limits", "Refunding Cancelled Bookings", "Booking Rules"] },
              { title: "System Troubleshooting", topics: ["Resetting Password", "Push Notification Settings", "Offline Gate Pass Logs"] }
            ].map((cat) => (
              <div key={cat.title} className="dashboard-card p-5">
                <h4 className="font-semibold text-sm text-foreground mb-3">{cat.title}</h4>
                <ul className="space-y-2">
                  {cat.topics.map((t, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground hover:text-primary cursor-pointer">
                      • {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Need personalized help?"
        subtitle="Log in and request direct technical assistance from your dashboard support tab."
      />
    </PublicLayout>
  );
}

// 4. API REFERENCE
export function ApiReferencePage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Developers
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">API Reference</h1>
          <p className="text-white/80 text-sm max-w-md">Integrate MapleOne tools, visitor alerts, and financial ledgers into third-party software.</p>
        </div>
      </section>

      {/* Section 2: Authentication Core */}
      <section className="py-12 bg-white">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Code size={20} className="text-primary" />
            Authentication
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            All requests to the MapleOne API must include a Bearer authentication token in the request header. You can generate API credentials inside your Super Admin portal settings panel.
          </p>
          <pre className="p-4 bg-muted rounded-xl text-xs overflow-x-auto border border-border">
            <code>{`Authorization: Bearer m1_live_token_xxxxxx\nContent-Type: application/json`}</code>
          </pre>
        </div>
      </section>

      {/* Section 3: REST Endpoints */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Primary Endpoint Routes</h2>
          <div className="space-y-4">
            {[
              { method: "GET", path: "/api/v1/visitors", desc: "Retrieve a list of visitor passes and QR codes verified at terminals." },
              { method: "POST", path: "/api/v1/visitors/preapprove", desc: "Pre-approve a guest delivery entry generating a secure code." },
              { method: "GET", path: "/api/v1/bills/status", desc: "Fetch pending dues for specific flats and residents in real-time." },
              { method: "POST", path: "/api/v1/complaints/raise", desc: "Programmatically raise maintenance requests with priority level." }
            ].map((endpoint) => (
              <div key={endpoint.path} className="dashboard-card p-5 border border-border flex items-start gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${endpoint.method === "GET" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {endpoint.method}
                </span>
                <div>
                  <code className="text-xs font-bold text-foreground">{endpoint.path}</code>
                  <p className="text-muted-foreground text-xs mt-1">{endpoint.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Ready to build?"
        subtitle="Log in to view webhook triggers and access developer credentials panel."
      />
    </PublicLayout>
  );
}

// 5. VIDEO TUTORIALS
export function TutorialsPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Video
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Video Tutorials</h1>
          <p className="text-white/80 text-sm max-w-md">Learn how to navigate and manage MapleOne components through video guides.</p>
        </div>
      </section>

      {/* Section 2: Getting Started Guides */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Getting Started Video Series</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Resident App Overview", time: "4m 20s", host: "Anya Sharma (CS Manager)" },
              { title: "RWA Financial Ledger Config", time: "8m 15s", host: "Varun Mehta (Fin Specialist)" },
              { title: "Security Gate QR Integration", time: "5m 30s", host: "Rajesh Kumar (Operations Manager)" }
            ].map((vid, idx) => (
              <div key={idx} className="dashboard-card p-5 border border-border">
                <div className="aspect-video bg-muted rounded-xl mb-4 flex items-center justify-center text-primary relative overflow-hidden border border-border hover:opacity-95 cursor-pointer">
                  <Play size={32} />
                  <span className="absolute bottom-2 right-2 text-xs bg-black/75 text-white px-2 py-0.5 rounded font-mono">
                    {vid.time}
                  </span>
                </div>
                <h3 className="font-bold text-sm">{vid.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Hosted by {vid.host}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Advanced Guides */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold mb-4">Advanced Configuration Playlists</h2>
          <div className="space-y-4">
            {[
              { name: "Setting Up Smart Billing Tiers", desc: "Learn to configure penalty thresholds, automate discounts, and download monthly receipt summaries." },
              { name: "Vendor Marketplace & Catalog Onboarding", desc: "Step-by-step video on how RWA registers external plumbing, dry cleaning, and grocery vendors." },
              { name: "SOS Protocols & Security Guard Alerts Integration", desc: "Configuring the emergency panic rules triggering alerts at security gates and committee panels." }
            ].map((adv, idx) => (
              <div key={idx} className="dashboard-card p-5 flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                  <Video size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{adv.name}</h4>
                  <p className="text-muted-foreground text-xs mt-1">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Looking for standard manuals?"
        subtitle="Log in and explore our text guides and documentation articles."
      />
    </PublicLayout>
  );
}

// 6. BLOG PAGE
export function BlogPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Blog
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">MapleOne Journal</h1>
          <p className="text-white/80 text-sm max-w-md">Insights, updates, and best practices on residential society governance and smart automation.</p>
        </div>
      </section>

      {/* Section 2: Featured Article */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Featured Article</h2>
          <div className="dashboard-card p-6 md:p-8 border border-primary/20 bg-primary/5 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 aspect-video bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Featured Image Placeholder</span>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <span className="text-xs font-bold text-primary uppercase">Smart Governance</span>
              <h3 className="text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                How AI is Transforming Residential Gated Community Safety Protocols
              </h3>
              <p className="text-muted-foreground text-xs">
                AI assistance systems are optimizing vendor onboarding and predictive safety checks. We analyze data from 100+ communities to map best practices.
              </p>
              <div className="text-xs text-muted-foreground">
                <span>By Rajesh Kumar</span> • <span>May 25, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Recent Articles Grid */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Recent Articles</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { cat: "Finance", title: "10 Ways to Improve Your Society's Fee Collection Rate", date: "May 10, 2025", read: "5 min" },
              { cat: "Operations", title: "Optimizing Visitor Approvals and Delivery Queues at the Gate", date: "Apr 28, 2025", read: "8 min" },
              { cat: "Legal", title: "Understanding RWA Bylaws and Compliance Checklists under RERA", date: "Apr 15, 2025", read: "6 min" },
              { cat: "Technology", title: "Transitioning to Smart Prepaid Water and Electricity Meters", date: "Mar 30, 2025", read: "4 min" }
            ].map((post, idx) => (
              <div key={idx} className="dashboard-card p-5 hover:shadow-card-hover transition-shadow cursor-pointer">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{post.cat}</span>
                <h4 className="font-bold text-sm mt-3 mb-2 leading-tight">{post.title}</h4>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.read} read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Ready to manage your community?"
        subtitle="Log in and get access to modern society tools."
      />
    </PublicLayout>
  );
}

// 7. COMMUNITY FORUM
export function CommunityForumPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Social
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Community Forum</h1>
          <p className="text-white/80 text-sm max-w-md">Connect with committee members and property managers across India to share insights and vendor recommendations.</p>
        </div>
      </section>

      {/* Section 2: Active Topics */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">Active Discussions</h2>
          <div className="space-y-4">
            {[
              { title: "Best vendor/agreements for solar panel installations in multi-tower buildings?", tags: ["Solar Energy", "Vendors"], replies: 28 },
              { title: "How to deal with commercial vehicle entry congestion during peak hours?", tags: ["Security", "Logistics"], replies: 15 },
              { title: "Standard template for society AGM minutes and agendas under State Bylaws?", tags: ["Legal", "Templates"], replies: 42 }
            ].map((topic, idx) => (
              <div key={idx} className="dashboard-card p-5 border border-border flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer">
                <div>
                  <h3 className="font-bold text-sm hover:text-primary transition-colors">{topic.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {topic.tags.map((t) => (
                      <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-primary text-sm">{topic.replies}</span>
                  <p className="text-[10px] text-muted-foreground uppercase">Replies</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Platform Guidelines */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold mb-2">Community Guidelines</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-foreground">Be Respectful</h4>
              <p className="text-muted-foreground text-xs mt-1">Keep discussions professional and constructive. Treat fellow society leaders with respect.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-border">
              <h4 className="font-semibold text-sm text-foreground">No Spam or Ads</h4>
              <p className="text-muted-foreground text-xs mt-1">Promotional links, unverified vendor ads, and spam messages are strictly prohibited.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Ready to participate?"
        subtitle="Log in to start a topic or comment on existing RWA feeds."
      />
    </PublicLayout>
  );
}

// 8. CAREERS PAGE
export function CareersPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Careers
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Join Our Team</h1>
          <p className="text-white/80 text-sm max-w-md">Build the future of community living with a fast-growing, mission-driven product team.</p>
        </div>
      </section>

      {/* Section 2: Core Values */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="dashboard-card p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Users size={22} />
              </div>
              <h3 className="font-bold text-sm">Community First</h3>
              <p className="text-muted-foreground text-xs">We design our products and processes to support and empower residential neighborhoods.</p>
            </div>
            <div className="dashboard-card p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Zap size={22} />
              </div>
              <h3 className="font-bold text-sm">Speed & Innovation</h3>
              <p className="text-muted-foreground text-xs">We ship updates quickly, integrating state-of-the-art AI systems and tools to improve workflows.</p>
            </div>
            <div className="dashboard-card p-5 text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                <Lock size={22} />
              </div>
              <h3 className="font-bold text-sm">Absolute Trust</h3>
              <p className="text-muted-foreground text-xs">We enforce strict verification checks and absolute data protection guidelines across all modules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Open Positions */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold mb-4">Open Positions</h2>
          {[
            { role: "Senior Frontend Engineer (React/TS)", dept: "Engineering", loc: "Noida / Remote" },
            { role: "UI/UX Product Designer", dept: "Design", loc: "Bangalore / Remote" },
            { role: "Enterprise Sales Lead (Proptech)", dept: "Sales", loc: "Mumbai / Onsite" }
          ].map((job, idx) => (
            <div key={idx} className="dashboard-card p-5 border border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">{job.role}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{job.dept} • {job.loc}</p>
              </div>
              <button className="btn-primary text-xs px-4 py-2 flex items-center gap-1">
                Apply <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Don't see a matching role?"
        subtitle="Keep checking back or log in to subscribe to recruitment notifications."
      />
    </PublicLayout>
  );
}

// 9. PRESS KIT PAGE
export function PressKitPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Media
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Press Kit & Assets</h1>
          <p className="text-white/80 text-sm max-w-md font-light">Official logos, company backgrounds, and press contact details for MapleOne media coverages.</p>
        </div>
      </section>

      {/* Section 2: Fact Sheet */}
      <section className="py-12 bg-white">
        <div className="page-container">
          <h2 className="text-xl font-bold mb-6">MapleOne Fact Sheet</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="dashboard-card p-5">
              <p className="text-2xl font-bold text-primary">2023</p>
              <p className="text-muted-foreground text-xs mt-1">Founded</p>
            </div>
            <div className="dashboard-card p-5">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground text-xs mt-1">Societies Managed</p>
            </div>
            <div className="dashboard-card p-5">
              <p className="text-2xl font-bold text-primary">100k+</p>
              <p className="text-muted-foreground text-xs mt-1">Active Residents</p>
            </div>
            <div className="dashboard-card p-5">
              <p className="text-2xl font-bold text-primary">Noida</p>
              <p className="text-muted-foreground text-xs mt-1">HQ Location</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Brand Guidelines */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Brand Guidelines & Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="dashboard-card p-5 border border-border">
              <h4 className="font-bold text-sm text-foreground">Logos & Iconography</h4>
              <p className="text-muted-foreground text-xs mt-1 mb-4 leading-relaxed">
                Download primary colors, white-transparencies, and high-definition rasterized MapleOne icons.
              </p>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
                <Download size={14} /> Download ZIP (12.4 MB)
              </button>
            </div>
            <div className="dashboard-card p-5 border border-border">
              <h4 className="font-bold text-sm text-foreground">Brand Color Palette</h4>
              <p className="text-muted-foreground text-xs mt-1 mb-4 leading-relaxed">
                Our core brand identity color palette: Primary Red (#B91C1C) and Secondary Gold (#D97706).
              </p>
              <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5">
                <Download size={14} /> Download HEX Sheet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Need to schedule a media interview?"
        subtitle="Log in to contact our media relations team or send an inquiry."
      />
    </PublicLayout>
  );
}

// 10. PRIVACY POLICY
export function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Legal
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Privacy Policy</h1>
          <p className="text-white/80 text-sm max-w-md">Last updated: May 1, 2025. Please review how we collect and protect your data.</p>
        </div>
      </section>

      {/* Section 2: Principles */}
      <section className="py-12 bg-white">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Core Privacy Principles
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-semibold text-xs text-foreground uppercase">Data Encryption</h4>
              <p className="text-muted-foreground text-[11px] mt-1">All personal entries, gate logs, and payment receipts are encrypted in transit and at rest.</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-semibold text-xs text-foreground uppercase">User Control</h4>
              <p className="text-muted-foreground text-[11px] mt-1">Residents have full autonomy to delete pre-approved guest codes and remove domestic staff history.</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-semibold text-xs text-foreground uppercase">No Third-party Sharing</h4>
              <p className="text-muted-foreground text-[11px] mt-1">We never trade, sell, or advertise resident records to external marketing corporations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Legal Terms */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Policy Details</h2>
          <div className="space-y-4">
            {[
              { title: "1. Information We Collect", content: "We collect onboarding profile details (name, phone, email, unit details) to authenticate your society residency. Gatekeepers record visitor logs, vehicle registration matching, and delivery timestamps at gate terminals." },
              { title: "2. How We Process Payments", content: "MapleOne doesn't store credit card details. Financial dues and RWA maintenance transactions are securely routed through PCI-DSS-compliant transaction gateway systems." },
              { title: "3. Compliance & Audits", content: "To protect community integrity, security gate logs are retained in local databases for a maximum period of 180 days, after which they are automatically expunged." }
            ].map((p, idx) => (
              <div key={idx} className="dashboard-card p-5">
                <h4 className="font-bold text-sm text-foreground mb-2">{p.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Have privacy compliance questions?"
        subtitle="Log in or contact our compliance officer directly for assistance."
      />
    </PublicLayout>
  );
}

// 11. TERMS OF SERVICE
export function TermsOfServicePage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Legal
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Terms of Service</h1>
          <p className="text-white/80 text-sm max-w-md">Please review the rules, terms, and agreements of using MapleOne services.</p>
        </div>
      </section>

      {/* Section 2: Basic Rules */}
      <section className="py-12 bg-white">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold">Key Terms Summary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-semibold text-xs text-foreground uppercase">RWA Responsibility</h4>
              <p className="text-muted-foreground text-[11px] mt-1">RWA committees are solely responsible for verifying flat resident ownership records before approving system access.</p>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <h4 className="font-semibold text-xs text-foreground uppercase">Service SLA</h4>
              <p className="text-muted-foreground text-[11px] mt-1">We target a 99.9% uptime for core gate scanner terminals, emergency SOS alerts, and billing configuration dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Clauses */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Terms of Agreement Clauses</h2>
          <div className="space-y-4">
            {[
              { title: "1. Account Verification & Safety", content: "Residents agree to submit accurate details. Security personnel will deny gate entry to visitors showing expired QR codes or non-compliant vehicle parameters." },
              { title: "2. Payment Gateways & Disputes", content: "Subscription pricing tiers are billed monthly/annually. Penalty allocations for overdue maintenance invoices are configured directly by your RWA committee rules." },
              { title: "3. Termination Protocols", content: "If a user profile is flagged for security violations or blocked by an administrator, platform access will be instantly revoked to protect society safety." }
            ].map((clause, idx) => (
              <div key={idx} className="dashboard-card p-5">
                <h4 className="font-bold text-sm text-foreground mb-2">{clause.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{clause.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Got legal inquiries?"
        subtitle="Log in or contact our compliance desk."
      />
    </PublicLayout>
  );
}

// 12. COOKIE POLICY
export function CookiePolicyPage() {
  return (
    <PublicLayout>
      {/* Section 1: Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
            Legal
          </span>
          <h1 className="section-title text-white mt-4 max-w-2xl">Cookie Policy</h1>
          <p className="text-white/80 text-sm max-w-md">Learn how and why MapleOne utilizes browser cookies to improve your user experience.</p>
        </div>
      </section>

      {/* Section 2: Overview */}
      <section className="py-12 bg-white">
        <div className="page-container max-w-4xl space-y-4">
          <h2 className="text-xl font-bold">Why We Use Cookies</h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            We use cookies to maintain your login session tokens, cache local preferences (such as light/dark mode settings), and retrieve visitor log filters quickly without reloading raw server data.
          </p>
        </div>
      </section>

      {/* Section 3: Cookie Details */}
      <section className="py-12 bg-background border-t border-border">
        <div className="page-container max-w-4xl space-y-6">
          <h2 className="text-xl font-bold">Types of Cookies Used</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="dashboard-card p-5">
              <span className="text-xs font-bold text-primary uppercase">Required</span>
              <h4 className="font-bold text-sm text-foreground mt-1">Session & Authentication Cookies</h4>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                Required for core website services, authenticating user role permissions, and keeping security protocols active.
              </p>
            </div>
            <div className="dashboard-card p-5">
              <span className="text-xs font-bold text-accent uppercase">Optional</span>
              <h4 className="font-bold text-sm text-foreground mt-1">Performance & Analytics Cookies</h4>
              <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                Helps us gather data on page load durations, broken routing links, and screen size formats to improve UI response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Auth CTA */}
      <AuthCTASection
        title="Ready to manage cookies?"
        subtitle="Review your cookie settings or clear browser cache inside your user settings panel."
      />
    </PublicLayout>
  );
}
