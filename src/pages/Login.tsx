import { useState } from "react";
import { Coffee, Mail, Lock, User, Loader2, Eye, EyeOff, ArrowRight, Phone, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const isPhone = /^\+?\d[\d\s-]{6,}$/.test(emailOrPhone.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = emailOrPhone.trim();

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to confirm, or sign in if auto-confirm is enabled.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Hero */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=1600&fit=crop"
          alt="Coffee ambiance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(25_60%_15%/0.88)] via-[hsl(25_50%_20%/0.78)] to-[hsl(20_70%_10%/0.92)]" />

        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-subtle" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-warm-gold/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: "1s" }} />
          <div className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-primary/5 blur-2xl animate-pulse-subtle" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Coffee className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Cafe Finder</span>
          </div>

          <div className="login-stagger-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3 text-warm-gold" />
              <span className="text-white/80">Discover 50+ cafes in Chennai</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold leading-[1.15] mb-4">
              Find Your
              <br />
              <span className="text-warm-gold">Perfect Brew</span>
              <br />
              Experience ☕
            </h2>
            <p className="text-base text-white/60 max-w-md leading-relaxed">
              Explore trending spots, cozy corners, and hidden gems. Your next favourite cafe is just a tap away.
            </p>

            <div className="flex items-center gap-8 mt-10">
              {[
                { value: "50+", label: "Cafes" },
                { value: "12", label: "Areas" },
                { value: "4.5★", label: "Rating" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-white/15" />}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/25">© {new Date().getFullYear()} Cafe Finder Chennai</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-6 md:p-12 bg-background relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-warm-gold/[0.03] blur-3xl" />
        </div>

        <div className="w-full max-w-[420px] relative z-10 login-stagger-2">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <Coffee className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl text-foreground">Cafe Finder</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/10">
              {isSignUp ? <Sparkles className="h-5 w-5 text-primary" /> : <Coffee className="h-5 w-5 text-primary" />}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isSignUp ? "Join the community and save your favourites" : "Sign in to explore Chennai's best cafes"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {isSignUp && (
              <FloatingInput
                icon={<User className="h-4 w-4" />}
                type="text"
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                focused={focused === "name"}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                required
                delay={0}
              />
            )}

            <FloatingInput
              icon={isPhone ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              type={isPhone ? "tel" : "email"}
              label="Email address or phone number"
              value={emailOrPhone}
              onChange={setEmailOrPhone}
              focused={focused === "email"}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              required
              delay={isSignUp ? 1 : 0}
            />

            <FloatingInput
              icon={<Lock className="h-4 w-4" />}
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={setPassword}
              focused={focused === "password"}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              required
              minLength={6}
              delay={isSignUp ? 2 : 1}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {!isSignUp && (
              <div className="flex justify-end pt-0.5">
                <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-4 text-muted-foreground font-medium">or continue with</span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) toast.error(error.message);
            }}
            className="group w-full py-3 rounded-2xl border border-border bg-card text-foreground font-medium text-sm hover:bg-accent hover:border-primary/20 transition-all duration-300 flex items-center justify-center gap-2.5 hover:shadow-md"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-semibold hover:underline underline-offset-2">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* Floating label input */
const FloatingInput = ({
  icon,
  suffix,
  type,
  label,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  required,
  minLength,
  delay,
}: {
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  required?: boolean;
  minLength?: number;
  delay: number;
}) => {
  const isActive = focused || value.length > 0;

  return (
    <div className="login-field-enter" style={{ animationDelay: `${delay * 0.1}s` }}>
      <div className={`relative group rounded-2xl border transition-all duration-300 ${
        focused
          ? "border-primary bg-primary/[0.03] shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]"
          : "border-border bg-background hover:border-muted-foreground/30"
      }`}>
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
          focused ? "text-primary" : "text-muted-foreground"
        }`}>
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          minLength={minLength}
          placeholder=" "
          className="peer w-full pl-10 pr-12 pt-5 pb-2 rounded-2xl bg-transparent text-foreground text-sm transition-all duration-300 focus:outline-none"
        />
        {/* Floating label */}
        <span className={`absolute left-10 transition-all duration-200 pointer-events-none ${
          isActive
            ? "top-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground/60"
        }`}>
          {label}
        </span>
        {suffix && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
