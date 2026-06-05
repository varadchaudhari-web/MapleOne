import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/solutions" },
    { label: "Pricing", href: "/pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-reference" },
    { label: "Video Tutorials", href: "/tutorials" },
    { label: "Blog", href: "/blog" },
    { label: "Community", href: "/community" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press-kit" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-maple-dark text-white">
      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-maple rounded-xl flex items-center justify-center shadow-primary">
                <span className="text-white font-bold">M1</span>
              </div>
              <span className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-primary">Maple</span>
                <span className="text-amber-300">One</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              India's most trusted AI-powered residential society management platform. Serving 500+ communities nationwide.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                <span>Sector 62, Noida, Uttar Pradesh 201301</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <span>+91 1800 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <span>hello@mapleone.app</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {[Twitter, Linkedin, Youtube, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="space-y-4">
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider">{group}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © 2025 MapleOne Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-white/70 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
