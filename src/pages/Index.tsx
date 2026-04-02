import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Coffee, MapPin, TrendingUp } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CafeSection from "@/components/CafeSection";
import { SkeletonSection } from "@/components/SkeletonCard";
import MoodSelector from "@/components/MoodSelector";
import heroBg from "@/assets/hero-bg.jpg";
import { getTrendingCafes, getWorkCafes, getRomanticCafes, getNearYouCafes } from "@/data/cafes";
import { useFavorites } from "@/hooks/useFavorites";
import { useAverageRatings } from "@/hooks/useAverageRatings";

const Index = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const userRatings = useAverageRatings();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (search.trim()) navigate(`/cafes?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative text-primary-foreground py-20 md:py-28 overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/60" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coffee className="h-8 w-8" />
              <span className="text-sm font-medium uppercase tracking-widest opacity-80">Discover Chennai</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Find Your Perfect
              <br />
              <span className="opacity-90">Cafe in Chennai</span>
            </h1>
            <p className="text-lg opacity-80 mb-8">
              Explore trending cafes, work-friendly spots, and romantic hideaways across the city.
            </p>
            <div className="max-w-lg mx-auto" onKeyDown={(e) => e.key === "Enter" && handleSearch()}>
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm opacity-70">
              <span className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> 8+ Cafes</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> 6+ Areas</span>
              <span className="flex items-center gap-1"><Search className="h-4 w-4" /> Real Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <>
            <SkeletonSection count={4} />
            <SkeletonSection count={4} />
            <SkeletonSection count={4} />
          </>
        ) : (
          <>
            <MoodSelector favorites={favorites} onToggleFavorite={toggleFavorite} userRatings={userRatings} />
            <CafeSection title="Trending in Chennai" emoji="🔥" cafes={getTrendingCafes()} horizontalScroll favorites={favorites} onToggleFavorite={toggleFavorite} userRatings={userRatings} />
            <CafeSection title="Best for Work" emoji="💻" cafes={getWorkCafes()} favorites={favorites} onToggleFavorite={toggleFavorite} userRatings={userRatings} />
            <CafeSection title="Romantic Cafes" emoji="❤️" cafes={getRomanticCafes()} favorites={favorites} onToggleFavorite={toggleFavorite} userRatings={userRatings} />
            <CafeSection title="Near You" emoji="📍" cafes={getNearYouCafes()} favorites={favorites} onToggleFavorite={toggleFavorite} userRatings={userRatings} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Cafe Finder Chennai</span>
          </div>
          <p className="text-sm text-muted-foreground">Discover the best cafes in Chennai &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
