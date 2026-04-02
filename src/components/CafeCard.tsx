import { Star, MapPin, Wifi, Heart, UtensilsCrossed, Flame, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { Cafe } from "@/data/cafes";
import { isTrendingCafe, isCafeOpen } from "@/data/cafes";

interface CafeCardProps {
  cafe: Cafe;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  userRating?: { avg: number; count: number };
  matchedMenuItems?: string[];
}

const CafeCard = ({ cafe, onToggleFavorite, isFavorite, userRating, matchedMenuItems }: CafeCardProps) => {
  const trending = isTrendingCafe(cafe);

  return (
    <Link to={`/cafe/${cafe.id}`} className="group block">
      <div className={`rounded-2xl overflow-hidden bg-card border card-hover ${trending ? "border-primary/40 ring-1 ring-primary/10" : "border-border"}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {trending && (
              <span className="bg-orange-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow-md animate-pulse-subtle">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            {isCafeOpen(cafe) ? (
              <span className="badge-open text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> Open · {cafe.openingTime}–{cafe.closingTime}</span>
            ) : (
              <span className="badge-closed text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> Closed · Opens {cafe.openingTime}</span>
            )}
            {cafe.hasWifi && (
              <span className="badge-tag text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <Wifi className="h-3 w-3" /> WiFi
              </span>
            )}
          </div>

          {/* Favorite */}
          {onToggleFavorite && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(cafe.id); }}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </button>
          )}

          {/* Price badge */}
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-foreground">
            ₹{cafe.priceMin}–₹{cafe.priceMax}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1.5">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {cafe.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="h-4 w-4 fill-warm-gold text-warm-gold" />
              <span className="text-sm font-semibold text-foreground">{cafe.rating}</span>
              {userRating ? (
                <span className="text-xs text-muted-foreground">
                  · <span className="text-primary font-medium">{userRating.avg}★</span> ({userRating.count})
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">({cafe.reviewCount})</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="text-sm line-clamp-1">{cafe.location}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cafe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="badge-tag text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>

          {matchedMenuItems && matchedMenuItems.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-primary">
              <UtensilsCrossed className="h-3 w-3 shrink-0" />
              <span className="truncate font-medium">
                Menu: {matchedMenuItems.slice(0, 2).join(", ")}{matchedMenuItems.length > 2 ? ` +${matchedMenuItems.length - 2} more` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CafeCard;
