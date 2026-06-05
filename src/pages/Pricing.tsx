import PublicLayout from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { CheckCircle, X, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 2999,
    units: "Up to 100 units",
    description: "Perfect for small housing societies getting started with digital management.",
    popular: false,
    features: {
      "Resident Management": true,
      "Visitor Management": true,
      "Basic Billing": true,
      "Community Feed": true,
      "Security Dashboard": true,
      "Facility Booking": false,
      "Advanced Analytics": false,
      "AI Assistant": false,
      "PDF Reports": false,
      "Priority Support": false,
      "API Access": false,
      "White Label": false,
    },
  },
  {
    name: "Professional",
    price: 7999,
    units: "Up to 500 units",
    description: "The complete platform for growing communities that need all core features.",
    popular: true,
    features: {
      "Resident Management": true,
      "Visitor Management": true,
      "Basic Billing": true,
      "Community Feed": true,
      "Security Dashboard": true,
      "Facility Booking": true,
      "Advanced Analytics": true,
      "AI Assistant": true,
      "PDF Reports": true,
      "Priority Support": true,
      "API Access": false,
      "White Label": false,
    },
  },
  {
    name: "Business",
    price: 19999,
    units: "Up to 2000 units",
    description: "For large communities and multi-property management companies.",
    popular: false,
    features: {
      "Resident Management": true,
      "Visitor Management": true,
      "Basic Billing": true,
      "Community Feed": true,
      "Security Dashboard": true,
      "Facility Booking": true,
      "Advanced Analytics": true,
      "AI Assistant": true,
      "PDF Reports": true,
      "Priority Support": true,
      "API Access": true,
      "White Label": false,
    },
  },
  {
    name: "Enterprise",
    price: 0,
    units: "Unlimited units",
    description: "Custom solutions for large builders, developers, and management companies.",
    popular: false,
    features: {
      "Resident Management": true,
      "Visitor Management": true,
      "Basic Billing": true,
      "Community Feed": true,
      "Security Dashboard": true,
      "Facility Booking": true,
      "Advanced Analytics": true,
      "AI Assistant": true,
      "PDF Reports": true,
      "Priority Support": true,
      "API Access": true,
      "White Label": true,
    },
  },
];

const faqs = [
  {
    q: "Is there a free trial available?",
    a: "Yes! All plans come with a 30-day free trial. No credit card required. You get access to all features in your selected plan during the trial.",
  },
  {
    q: "Can I change my plan later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately and are prorated.",
  },
  {
    q: "How is billing calculated?",
    a: "Our pricing is per-society per-month. The price is based on your plan tier, not on the number of residents or features used within the plan.",
  },
  {
    q: "Is data migration included?",
    a: "Yes. Our team helps migrate your existing resident data, billing records, and historical information at no extra cost.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, net banking, UPI, and NEFT. Annual billing saves you 20%.",
  },
  {
    q: "Is there a setup fee?",
    a: "No hidden fees. The price you see includes setup, onboarding, and training for your committee and staff.",
  },
];

export default function PricingPage() {
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
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="page-container text-center space-y-4">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Transparent Pricing</span>
          <h1 className="section-title max-w-2xl mx-auto">Simple Pricing for Every Community</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No hidden fees. No surprise charges. Choose the plan that fits your community's needs.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle size={16} />
            Save 20% with annual billing
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-background">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative dashboard-card p-6 flex flex-col ${
                  plan.popular ? "ring-2 ring-primary shadow-xl shadow-primary/10 !overflow-visible" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-maple text-white text-xs font-bold rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3">{plan.units}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    {plan.price === 0 ? (
                      <span className="text-3xl font-bold text-primary">Custom</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {Object.entries(plan.features).map(([feature, included]) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      {included ? (
                        <CheckCircle size={15} className="text-accent flex-shrink-0" />
                      ) : (
                        <X size={15} className="text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={included ? "text-foreground" : "text-muted-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={isAuthenticated ? getDashboardPath() : (plan.name === "Enterprise" ? "/contact" : "/signup")}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? "gradient-maple text-white hover:opacity-90"
                      : "border-2 border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {isAuthenticated ? "Go to Dashboard" : (plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Optional Add-Ons</h2>
            <p className="text-muted-foreground">Extend MapleOne with specialized modules for your community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { name: "Advanced AI Pack", price: "₹2,000/mo", desc: "Predictive analytics, AI chatbot, smart recommendations" },
              { name: "White Label Branding", price: "₹5,000/mo", desc: "Custom domain, logo, and brand colors across the app" },
              { name: "Extended Storage", price: "₹1,000/mo", desc: "100GB additional document and media storage" },
            ].map((addon, i) => (
              <div key={i} className="dashboard-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{addon.name}</h3>
                  <span className="text-primary font-semibold text-sm">{addon.price}</span>
                </div>
                <p className="text-muted-foreground text-sm">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="page-container max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <HelpCircle size={40} className="mx-auto text-primary mb-4" />
            <h2 className="section-title mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="dashboard-card p-6">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-maple text-white">
        <div className="page-container text-center space-y-6">
          <h2 className="section-title text-white">Start Your Free 30-Day Trial Today</h2>
          <Link
            to={isAuthenticated ? getDashboardPath() : "/signup"}
            className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-xl transition-all text-base"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started — No Credit Card"}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
