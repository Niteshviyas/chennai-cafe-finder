import { Coffee, Heart, User, Menu, X, Sun, Moon, LogOut, MapPin } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate("/");
  };

  // Hide navbar on auth pages
  const authPages = ["/login", "/forgot-password", "/reset-password"];
  if (authPages.includes(location.pathname)) return null;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/cafes", label: "Explore" },
    { to: "/areas", label: "Areas", icon: MapPin },
    { to: "/favorites", label: "Favorites", icon: Heart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-navbar">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Coffee className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-lg font-bold text-foreground">Cafe Finder <span className="text-primary">Chennai</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-accent transition-colors">
            {isDark ? <Sun className="h-4 w-4 text-warm-gold" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-accent transition-colors">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{profile?.display_name || "Profile"}</span>
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-full hover:bg-accent transition-colors" title="Sign Out">
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-medium text-foreground">
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-accent">
                {isDark ? <Sun className="h-4 w-4 text-warm-gold" /> : <Moon className="h-4 w-4" />}
              </button>
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-accent text-accent-foreground text-sm font-medium">
                    Profile
                  </Link>
                  <button onClick={handleSignOut}
                    className="px-4 py-2 rounded-2xl bg-destructive/10 text-destructive text-sm font-medium">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
