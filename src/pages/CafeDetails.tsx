import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Wifi, Heart, ArrowLeft, Clock, ExternalLink, CalendarDays } from "lucide-react";
import { getCafeById, isCafeOpen } from "@/data/cafes";
import { useFavorites } from "@/hooks/useFavorites";
import { useReviews } from "@/hooks/useReviews";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import BookingModal from "@/components/BookingModal";
import CafeGallery from "@/components/CafeGallery";
import TableSelector from "@/components/TableSelector";
import CafeMenu from "@/components/CafeMenu";

const CafeDetails = () => {
  const { id } = useParams();
  const cafe = getCafeById(id || "");
  const { favorites, toggleFavorite } = useFavorites();
  const { reviews, loading: reviewsLoading, addReview, deleteReview, userReview } = useReviews(id || "");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    setBookingOpen(true);
  };

  if (!cafe) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Cafe not found</h2>
          <Link to="/cafes" className="text-primary hover:underline">Browse all cafes</Link>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(cafe.id);
  const galleryImages = cafe.images?.length ? [cafe.image, ...cafe.images] : [cafe.image];


  return (
    <div className="min-h-screen pt-16">
      {/* Gallery Banner */}
      <div className="relative">
        <CafeGallery images={galleryImages} cafeName={cafe.name} />
        <div className="absolute top-4 left-4 z-10">
          <Link to="/cafes" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/80 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8" style={{ boxShadow: "var(--shadow-hover)" }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{cafe.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {cafe.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {isCafeOpen(cafe) ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Open Now</span> : <span className="text-destructive font-medium">Closed</span>} · {cafe.openingTime} – {cafe.closingTime}</span>
                {cafe.hasWifi && <span className="flex items-center gap-1"><Wifi className="h-4 w-4" /> WiFi Available</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setBookingOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <CalendarDays className="h-4 w-4" /> Book a Table
              </button>
              <div className="flex items-center gap-1.5 bg-accent px-3 py-2 rounded-xl">
                <Star className="h-5 w-5 fill-warm-gold text-warm-gold" />
                <span className="font-bold text-foreground">{cafe.rating}</span>
                <span className="text-sm text-muted-foreground">({cafe.reviewCount})</span>
              </div>
              <button
                onClick={() => toggleFavorite(cafe.id)}
                className={`p-2.5 rounded-xl border transition-colors ${isFav ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" : "border-border hover:bg-accent"}`}
              >
                <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </button>
            </div>
          </div>

          {/* Tags & Price */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
              ₹{cafe.priceMin}–₹{cafe.priceMax}
            </span>
            {cafe.tags.map(tag => (
              <span key={tag} className="badge-tag text-xs px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          {/* About Section */}
          <div className="mb-10 p-6 md:p-8 rounded-2xl bg-muted/40 border border-border/60">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              ☕ About {cafe.name}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">{cafe.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/50">
                <span className="text-2xl">🎨</span>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ambience</span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{cafe.tags.includes("Rooftop") ? "Rooftop & Breezy" : cafe.tags.includes("Cozy") ? "Cozy & Intimate" : cafe.tags.includes("Pet Friendly") ? "Relaxed & Pet-Friendly" : "Modern & Vibrant"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/50">
                <span className="text-2xl">⭐</span>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialty</span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{cafe.tags.includes("Filter Coffee") ? "Filter Coffee" : cafe.tags.includes("Desserts") ? "Artisan Desserts" : cafe.tags.includes("Brunch") ? "Brunch Favourites" : "Signature Blends"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/50">
                <span className="text-2xl">✨</span>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vibe</span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{cafe.tags.includes("Study Spot") ? "Study & Work" : cafe.tags.includes("Date Spot") ? "Date Night" : cafe.tags.includes("Live Music") ? "Live Music" : "Chill Hangout"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Select Your Table */}
          <TableSelector cafeId={cafe.id} onSelectTable={handleTableSelect} />

          {/* Menu */}
          {cafe.menu && cafe.menu.length > 0 && (
            <CafeMenu menu={cafe.menu} />
          )}

          {/* Reviews */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">💬 Reviews</h2>
            <div className="space-y-5">
              <ReviewForm onSubmit={addReview} hasExistingReview={!!userReview} />
              <ReviewList reviews={reviews} loading={reviewsLoading} onDelete={deleteReview} />
              {cafe.reviews.map((review, i) => (
                <div key={`static-${i}`} className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{review.name}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-warm-gold text-warm-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">{review.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <a
            href={cafe.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <MapPin className="h-4 w-4" /> View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => { setBookingOpen(false); setSelectedTable(null); }}
        cafeName={cafe.name}
        cafeId={cafe.id}
        cafeLocation={cafe.location}
        selectedTable={selectedTable}
      />
    </div>
  );
};

export default CafeDetails;
