import { Heart, Clock, LogOut, Settings, CalendarDays, Users, Coffee, MapPin, XCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CafeCard from "@/components/CafeCard";
import ProfileEditor from "@/components/ProfileEditor";
import { cafes } from "@/data/cafes";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  cafe_id: string;
  cafe_name: string;
  guest_name: string;
  members: number;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

const Profile = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [editing, setEditing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false });
    if (data) setBookings(data as Booking[]);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to cancel reservation.", variant: "destructive" });
    } else {
      toast({ title: "Reservation cancelled", description: "Your booking has been cancelled." });
      await fetchBookings();
    }
    setCancellingId(null);
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const favCafes = cafes.filter(c => favorites.includes(c.id)).slice(0, 4);
  const recentCafes = cafes.slice(0, 3);

  const initials = (profile?.display_name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const upcomingBookings = bookings.filter(b => b.booking_date >= new Date().toISOString().split("T")[0] && b.status === "confirmed");
  const pastBookings = bookings.filter(b => b.booking_date < new Date().toISOString().split("T")[0] || b.status !== "confirmed");

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 border-2 border-border">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="Avatar" />
                ) : null}
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.display_name || "Cafe Lover"}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                <Settings className="h-4 w-4" /> {editing ? "Done" : "Edit Profile"}
              </button>
              <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-6 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        {editing && (
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-xl font-semibold text-foreground mb-6">Edit Profile</h2>
            <ProfileEditor />
          </div>
        )}

        {/* Your Reservations */}
        {bookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-5">
              <CalendarDays className="h-5 w-5 text-primary" /> Your Reservations
            </h2>

            {upcomingBookings.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Upcoming</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} variant="upcoming" onCancel={handleCancel} cancelling={cancellingId === b.id} />
                  ))}
                </div>
              </div>
            )}

            {pastBookings.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Past</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastBookings.map((b) => (
                    <BookingCard key={b.id} booking={b} variant="past" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Saved */}
        {favCafes.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2"><Heart className="h-5 w-5 text-destructive" /> Saved Cafes</h2>
              <Link to="/favorites" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {favCafes.map(c => <CafeCard key={c.id} cafe={c} isFavorite onToggleFavorite={toggleFavorite} />)}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4"><Clock className="h-5 w-5 text-muted-foreground" /> Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentCafes.map(c => <CafeCard key={c.id} cafe={c} isFavorite={favorites.includes(c.id)} onToggleFavorite={toggleFavorite} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, variant, onCancel, cancelling }: { booking: Booking; variant: "upcoming" | "past"; onCancel?: (id: string) => void; cancelling?: boolean }) => {
  const isPast = variant === "past";
  const isCancelled = booking.status === "cancelled";
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        isCancelled
          ? "border-destructive/20 bg-destructive/5 opacity-60"
          : isPast
          ? "border-border/50 bg-muted/30 opacity-70"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <Link to={`/cafe/${booking.cafe_id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCancelled ? "bg-destructive/10" : isPast ? "bg-muted" : "bg-primary/15"}`}>
            <Coffee className={`h-4 w-4 ${isCancelled ? "text-destructive" : isPast ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{booking.cafe_name}</h3>
            <p className="text-xs text-muted-foreground">{booking.guest_name}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isCancelled
              ? "bg-destructive/15 text-destructive"
              : isPast
              ? "bg-muted text-muted-foreground"
              : "bg-primary/15 text-primary"
          }`}>
            {isCancelled ? "Cancelled" : isPast ? "Completed" : "Confirmed"}
          </span>
          {!isPast && !isCancelled && onCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancelling}
              className="p-1.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
              title="Cancel reservation"
            >
              <XCircle className={`h-4 w-4 ${cancelling ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" /> {booking.booking_date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {booking.booking_time}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" /> {booking.members} {booking.members === 1 ? "guest" : "guests"}
        </span>
      </div>
    </div>
  );
};

export default Profile;
