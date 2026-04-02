import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import CafeCard from "@/components/CafeCard";
import { cafes } from "@/data/cafes";
import { useFavorites } from "@/hooks/useFavorites";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const favCafes = cafes.filter(c => favorites.includes(c.id));

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">❤️ Your Favorites</h1>
        <p className="text-muted-foreground mb-8">Cafes you've saved for later</p>

        {favCafes.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-4">Start exploring and save cafes you love!</p>
            <Link to="/cafes" className="inline-flex px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Explore Cafes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favCafes.map((cafe, i) => (
              <div key={cafe.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <CafeCard cafe={cafe} isFavorite onToggleFavorite={toggleFavorite} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
