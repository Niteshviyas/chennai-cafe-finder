import type { Cafe } from "@/data/cafes";
import CafeCard from "./CafeCard";

interface CafeSectionProps {
  title: string;
  emoji: string;
  cafes: Cafe[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userRatings?: Record<string, { avg: number; count: number }>;
  horizontalScroll?: boolean;
}

const CafeSection = ({ title, emoji, cafes, favorites, onToggleFavorite, userRatings, horizontalScroll }: CafeSectionProps) => {
  if (cafes.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {emoji} {title}
      </h2>
      {horizontalScroll ? (
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {cafes.map((cafe, i) => (
            <div key={cafe.id} className="min-w-[280px] max-w-[300px] snap-start shrink-0 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CafeCard
                cafe={cafe}
                isFavorite={favorites.includes(cafe.id)}
                onToggleFavorite={onToggleFavorite}
                userRating={userRatings?.[cafe.id]}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cafes.map((cafe, i) => (
            <div key={cafe.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <CafeCard
                cafe={cafe}
                isFavorite={favorites.includes(cafe.id)}
                onToggleFavorite={onToggleFavorite}
                userRating={userRatings?.[cafe.id]}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CafeSection;
