import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { X, LogIn, UserPlus, Star, Shield, Zap, Bell } from "lucide-react";

const benefits = [
  { icon: Shield, text: "Secure QR visitor management" },
  { icon: Zap, text: "Real-time maintenance tracking" },
  { icon: Bell, text: "Instant community notifications" },
  { icon: Star, text: "Smart facility booking system" },
];

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useAppStore();
  const navigate = useNavigate();

  if (!authModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div
        className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-hero p-6 text-white flex-shrink-0">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="font-bold text-sm">M1</span>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">MapleOne Premium</p>
              <h2 className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sign In Required
              </h2>
            </div>
          </div>
          <p className="text-white/80 text-sm">
            Access this feature and many more with your MapleOne account.
          </p>
        </div>

        {/* Benefits */}
        <div className="p-6 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            What You'll Unlock
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl">
                <b.icon size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-xs text-foreground/80 leading-tight">{b.text}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setAuthModalOpen(false); navigate("/login"); }}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In to MapleOne
            </button>
            <button
              onClick={() => { setAuthModalOpen(false); navigate("/signup"); }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-all"
            >
              <UserPlus size={18} />
              Create Free Account
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            30-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
