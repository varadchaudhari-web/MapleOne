import { useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { ArrowLeft, Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6">
          <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={28} />
            </div>
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your registered email and we'll send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-bold text-green-800">Reset Link Sent!</h3>
              <p className="text-green-700 text-sm">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-2">
                Back to Login <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="input-field"
                />
              </div>
              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
