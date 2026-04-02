import { useState, useEffect } from "react";
import { X, CalendarDays, Users, Phone, Mail, MessageCircle, CheckCircle2, Coffee, Clock, Sparkles, ArrowRight, ArrowLeft, MapPin, User } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  members: z.number().min(1).max(10),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
});

type BookingData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafeName: string;
  cafeId: string;
  cafeLocation: string;
  selectedTable?: string | null;
}

const MEMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

const BookingModal = ({ isOpen, onClose, cafeName, cafeId, cafeLocation, selectedTable }: BookingModalProps) => {
  const { user } = useAuth();
  const [form, setForm] = useState<BookingData>({
    name: "", phone: "", email: "", members: 2, date: "", time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (field: keyof BookingData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setSubmitted(false);
      setStep(0);
      setForm({ name: "", phone: "", email: "", members: 2, date: "", time: "" });
      setErrors({});
      onClose();
    }, 250);
  };

  const validateStep1 = () => {
    const partial = bookingSchema.pick({ name: true, phone: true, email: true, members: true });
    const result = partial.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (user) {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        cafe_id: cafeId,
        cafe_name: cafeName,
        guest_name: form.name,
        phone: form.phone,
        email: form.email,
        members: form.members,
        booking_date: form.date,
        booking_time: form.time,
      });

      if (error) {
        toast({
          title: "Booking failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "🎉 Booking Confirmed!",
      description: `Table ${selectedTable ? selectedTable + " " : ""}at ${cafeName} on ${form.date} at ${form.time} for ${form.members} guest${form.members > 1 ? "s" : ""}. A confirmation has been sent to ${form.email}.`,
    });

    setSubmitted(true);
  };

  const bookingText = `Hi! I'd like to book ${selectedTable ? `Table ${selectedTable} at` : "a table at"} ${cafeName}, ${cafeLocation}.\n\nName: ${form.name}\nMembers: ${form.members}\nDate: ${form.date}\nTime: ${form.time}\nPhone: ${form.phone}\nEmail: ${form.email}`;
  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(bookingText)}`;
  const gmailUrl = `mailto:?subject=${encodeURIComponent(`Table Booking - ${cafeName}`)}&body=${encodeURIComponent(bookingText)}`;

  const animClass = closing ? "booking-modal-exit" : "booking-modal-enter";
  const backdropClass = closing ? "booking-backdrop-exit" : "booking-backdrop-enter";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleClose}>
      <div className={`absolute inset-0 bg-foreground/50 backdrop-blur-xl ${backdropClass}`} />

      <div
        className={`relative w-full sm:max-w-lg bg-card sm:rounded-3xl rounded-t-3xl border border-border/80 overflow-hidden shadow-2xl ${animClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-border/80" />
        </div>

        {/* Header */}
        <div className="relative px-6 pt-5 pb-5 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/8" />
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-accent/15 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/15 shadow-sm shadow-primary/10">
                <Coffee className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">Book a Table</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3 w-3 text-primary/70" />
                  <p className="text-xs text-muted-foreground font-medium">
                    {cafeName}{selectedTable ? ` · Table ${selectedTable}` : ""}
                  </p>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className="p-2.5 -mr-2 -mt-1 rounded-xl hover:bg-foreground/5 transition-all group active:scale-95">
              <X className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>

          {/* Step indicator */}
          {!submitted && (
            <div className="relative flex items-center gap-3 mt-5">
              <StepPill step={1} label="Guest Info" active={step === 0} done={step > 0} />
              <div className={`flex-1 h-px transition-colors duration-500 ${step > 0 ? "bg-primary/50" : "bg-border"}`} />
              <StepPill step={2} label="Schedule" active={step === 1} done={submitted} />
            </div>
          )}
        </div>

        {submitted ? (
          /* ── Success State ── */
          <div className="px-6 pb-8 pt-2 text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute w-24 h-24 rounded-full bg-primary/8 booking-pulse" />
              <div className="absolute w-20 h-20 rounded-full bg-primary/12 booking-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center booking-success-pop shadow-lg shadow-primary/15">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-1 booking-fade-up" style={{ animationDelay: "0.3s" }}>
              You're all set! 🎉
            </h3>
            <p className="text-sm text-muted-foreground mb-5 booking-fade-up" style={{ animationDelay: "0.35s" }}>
              Your reservation has been confirmed
            </p>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl p-5 mb-6 text-left border border-border/50 booking-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="grid grid-cols-2 gap-4">
                <SummaryItem icon={<User className="h-3.5 w-3.5" />} label="Guest" value={form.name} />
                <SummaryItem icon={<Users className="h-3.5 w-3.5" />} label="Party" value={`${form.members} ${form.members === 1 ? "guest" : "guests"}`} />
                <SummaryItem icon={<CalendarDays className="h-3.5 w-3.5" />} label="Date" value={form.date} />
                <SummaryItem icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={form.time} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4 booking-fade-up font-medium" style={{ animationDelay: "0.5s" }}>
              Share your booking
            </p>

            <div className="flex gap-3 justify-center booking-fade-up" style={{ animationDelay: "0.6s" }}>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-[0.98]"
                style={{ background: "#25D366", color: "white" }}
              >
                <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-12" /> WhatsApp
              </a>
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-[0.98]"
                style={{ background: "#EA4335", color: "white" }}
              >
                <Mail className="h-4 w-4 transition-transform group-hover:-rotate-12" /> Email
              </a>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors booking-fade-up"
              style={{ animationDelay: "0.7s" }}
            >
              Close
            </button>
          </div>
        ) : step === 0 ? (
          /* ── Step 1: Guest Details ── */
          <div className="px-6 pb-6 pt-1 space-y-4 max-h-[60vh] overflow-y-auto">
            <ModernField label="Full Name" error={errors.name} delay={0} icon={<User className="h-4 w-4" />}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                maxLength={100}
              />
            </ModernField>

            <ModernField label="Phone Number" error={errors.phone} delay={1} icon={<Phone className="h-4 w-4" />}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </ModernField>

            <ModernField label="Email Address" error={errors.email} delay={2} icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                maxLength={255}
              />
            </ModernField>

            {/* Members */}
            <div className="booking-fade-up" style={{ animationDelay: `${3 * 0.08}s` }}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2.5 block">
                Number of Guests
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {MEMBER_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleChange("members", n)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                      form.members === n
                        ? "bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/25"
                        : "bg-muted/50 text-foreground hover:bg-accent border border-border/60 hover:border-primary/30"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-3"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* ── Step 2: Date & Time ── */
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-1 space-y-4">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <ModernField label="Select Date" error={errors.date} delay={0} icon={<CalendarDays className="h-4 w-4" />}>
              <input
                type="date"
                value={form.date}
                min={today}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
              />
            </ModernField>

            {/* Time slots grid */}
            <div className="booking-fade-up" style={{ animationDelay: "0.08s" }}>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2.5 block">
                Select Time {errors.time && <span className="text-destructive normal-case tracking-normal font-medium">· {errors.time}</span>}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleChange("time", slot)}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      form.time === slot
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]"
                        : "bg-muted/40 text-foreground hover:bg-accent border border-border/50 hover:border-primary/30"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-muted/50 to-muted/20 rounded-2xl p-4 border border-border/40 booking-fade-up" style={{ animationDelay: "0.16s" }}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2.5">Booking Preview</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-foreground">{form.name}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-muted-foreground">{form.members} {form.members === 1 ? "guest" : "guests"}</span>
                {form.date && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-muted-foreground">{form.date}</span>
                  </>
                )}
                {form.time && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-primary font-semibold">{form.time}</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-bold text-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const StepPill = ({ step, label, active, done }: { step: number; label: string; active: boolean; done: boolean }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${
    done
      ? "bg-primary/15 text-primary"
      : active
      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
      : "bg-muted/60 text-muted-foreground border border-border/60"
  }`}>
    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
      done ? "bg-primary text-primary-foreground" : active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border text-muted-foreground"
    }`}>
      {done ? "✓" : step}
    </span>
    {label}
  </div>
);

const ModernField = ({
  label,
  error,
  delay,
  icon,
  children,
}: {
  label: string;
  error?: string;
  delay: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="booking-fade-up" style={{ animationDelay: `${delay * 0.08}s` }}>
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1.5 block">
      {label}
    </label>
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-muted/20 focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-sm focus-within:shadow-primary/5 ${
      error ? "border-destructive/50 bg-destructive/5" : "border-border/60"
    }`}>
      <span className="text-muted-foreground/60 shrink-0">{icon}</span>
      {children}
    </div>
    {error && (
      <p className="text-xs text-destructive mt-1.5 flex items-center gap-1.5 font-medium booking-fade-up">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
        {error}
      </p>
    )}
  </div>
);

const SummaryItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-primary/60 mt-0.5 shrink-0">{icon}</span>
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
    </div>
  </div>
);

export default BookingModal;
