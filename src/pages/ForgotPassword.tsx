import { useState } from "react";
import { Coffee, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your email for a reset link!");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center gradient-warm">
      <div className="w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-card rounded-2xl border border-border p-8" style={{ boxShadow: "var(--shadow-hover)" }}>
          <div className="text-center mb-8">
            <Coffee className="h-7 w-7 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll send you a link to reset it</p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <p className="text-foreground font-medium mb-2">Email sent! ✉️</p>
              <p className="text-sm text-muted-foreground mb-6">Check your inbox for a password reset link.</p>
              <Link to="/login" className="text-primary font-medium hover:underline text-sm">← Back to Sign In</Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm transition-all" />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Reset Link
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/login" className="hover:text-foreground transition-colors flex items-center justify-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
