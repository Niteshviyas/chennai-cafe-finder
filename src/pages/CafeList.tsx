import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Loader2, ArrowUp, ArrowUpDown, Tag, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CafeCard from "@/components/CafeCard";
import FilterSidebar from "@/components/FilterSidebar";
import SkeletonCard from "@/components/SkeletonCard";
import { cafes, isCafeOpen } from "@/data/cafes";
import { useFavorites } from "@/hooks/useFavorites";
import { useAverageRatings } from "@/hooks/useAverageRatings";

const PAGE_SIZE = 12;
const popularTags = ["WiFi Available", "Pet Friendly", "Rooftop", "Outdoor", "Best for Work", "Romantic Spot", "Budget Friendly", "Desserts", "Live Music", "Specialty Coffee"];

const CafeList = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ priceRange: "all", minRating: 0, wifiOnly: false, openNow: false, areas: initialArea ? [initialArea] : [] as string[] });
  const { favorites, toggleFavorite } = useFavorites();
  const [sortBy, setSortBy] = useState<"default" | "rating" | "price-low" | "price-high" | "name">("default");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const userRatings = useAverageRatings();
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return cafes
      .map(c => {
        const matchedMenuItems = q && c.menu
          ? c.menu.filter(m => m.name.toLowerCase().includes(q)).map(m => m.name)
          : [];
        return { cafe: c, matchedMenuItems };
      })
      .filter(({ cafe: c, matchedMenuItems }) => {
        if (q && !c.name.toLowerCase().includes(q) && !c.area.toLowerCase().includes(q) && matchedMenuItems.length === 0) return false;
        if (filters.areas.length > 0 && !filters.areas.includes(c.area)) return false;
        if (filters.minRating && c.rating < filters.minRating) return false;
        if (filters.wifiOnly && !c.hasWifi) return false;
        if (filters.openNow && !isCafeOpen(c)) return false;
        if (filters.priceRange === "budget" && c.priceMax > 300) return false;
        if (filters.priceRange === "mid" && (c.priceMin > 700 || c.priceMax < 300)) return false;
        if (filters.priceRange === "premium" && c.priceMin < 700) return false;
        if (activeTags.length > 0 && !activeTags.every(tag => c.tags.includes(tag))) return false;
        return true;
      });
  }, [search, filters, activeTags]);

  // Sort filtered results
  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "rating": return list.sort((a, b) => b.cafe.rating - a.cafe.rating);
      case "price-low": return list.sort((a, b) => a.cafe.priceMin - b.cafe.priceMin);
      case "price-high": return list.sort((a, b) => b.cafe.priceMax - a.cafe.priceMax);
      case "name": return list.sort((a, b) => a.cafe.name.localeCompare(b.cafe.name));
      default: return list;
    }
  }, [filtered, sortBy]);

  // Reset visible count when filters/search/sort/tags change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, filters, sortBy, activeTags]);

  const hasMore = visibleCount < sorted.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + PAGE_SIZE, sorted.length));
      setLoadingMore(false);
    }, 300);
  }, [hasMore, loadingMore, sorted.length]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const visibleCafes = sorted.slice(0, visibleCount);

  // Back to top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen pt-16 flex">
      <FilterSidebar filters={filters} onChange={setFilters} isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-card border border-border hover:bg-accent transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <SearchBar value={search} onChange={setSearch} className="flex-1" placeholder="Search cafes, areas, or menu items…" />
        </div>
        {/* Popular Tags */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
          {popularTags.map(tag => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => setActiveTags(prev => isActive ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary scale-105"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {tag}
              </button>
            );
          })}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              className="shrink-0 text-xs text-primary hover:underline flex items-center gap-1 ml-1"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {sorted.length} cafes found
            {sorted.length > PAGE_SIZE && (
              <span className="text-foreground/50"> · showing {Math.min(visibleCount, sorted.length)}</span>
            )}
          </p>
          <div className="relative">
            <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none pl-8 pr-8 py-2 text-sm rounded-xl bg-card border border-border text-foreground hover:bg-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="default">Default</option>
              <option value="rating">Rating ↓</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No cafes match your filters. Try adjusting them!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {visibleCafes.map(({ cafe, matchedMenuItems }, i) => (
                <div key={cafe.id} className="animate-fade-in" style={{ animationDelay: `${(i % PAGE_SIZE) * 60}ms` }}>
                  <CafeCard cafe={cafe} isFavorite={favorites.includes(cafe.id)} onToggleFavorite={toggleFavorite} userRating={userRatings[cafe.id]} matchedMenuItems={matchedMenuItems} />
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="py-8 flex justify-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading more cafes…
                </div>
              )}
              {!hasMore && sorted.length > PAGE_SIZE && (
                <p className="text-sm text-muted-foreground">You've seen all {sorted.length} cafes ☕</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all duration-300 ${
          showBackToTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-75 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CafeList;
