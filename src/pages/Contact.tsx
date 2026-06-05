import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", type: "General Inquiry" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 gradient-hero text-white">
        <div className="page-container text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="section-title text-white">Get in Touch</h1>
          <p className="text-white/80 text-lg">
            Have questions about MapleOne? Our team is ready to help you find the perfect solution for your community.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="page-container">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Information</h2>
              <p className="text-muted-foreground">Our friendly team is always here to chat. Reach out through any of these channels.</p>

              {[
                { icon: Mail, title: "Email Us", info: "hello@mapleone.app", sub: "We reply within 4 hours" },
                { icon: Phone, title: "Call Us", info: "+91 1800 123 4567", sub: "Mon-Sat, 9AM-7PM IST" },
                { icon: MapPin, title: "Visit Us", info: "Sector 62, Noida, UP 201301", sub: "By appointment only" },
                { icon: Clock, title: "Business Hours", info: "Mon – Sat: 9 AM – 7 PM", sub: "Emergency support 24/7" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-foreground text-sm">{item.info}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}

              {/* Office Locations */}
              <div className="bg-muted/50 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Our Offices</h3>
                {["Noida (HQ)", "Mumbai", "Bangalore", "Pune", "Hyderabad"].map((city) => (
                  <div key={city} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    {city}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="dashboard-card p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. Our team will get back to you within 4 business hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "", type: "General Inquiry" }); }}
                    className="btn-primary px-8 py-3 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="dashboard-card p-8 space-y-5">
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Send us a Message</h2>

                  <div className="grid grid-cols-2 gap-3">
                    {["General Inquiry", "Sales & Pricing", "Technical Support", "Partnership"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, type })}
                        className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                          form.type === type ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Your Name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Full name"
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Subject *</label>
                    <input
                      required
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="What's this about?"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us more about your community and what you need..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
