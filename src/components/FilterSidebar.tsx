import { SlidersHorizontal, X, MapPin } from "lucide-react";
import { cafes } from "@/data/cafes";
import { useMemo } from "react";

export interface Filters {
  priceRange: string;
  minRating: number;
  wifiOnly: boolean;
  openNow: boolean;
  areas: string[];
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  isOpen: boolean;
  onClose: () => void;
}

const priceOptions = [
  { label: "All Prices", value: "all" },
  { label: "₹100–₹300", value: "budget" },
  { label: "₹300–₹700", value: "mid" },
  { label: "₹700+", value: "premium" },
];

const ratingOptions = [
  { label: "Any", value: 0 },
  { label: "4+ ⭐", value: 4 },
  { label: "4.5+ ⭐", value: 4.5 },
];

const FilterSidebar = ({ filters, onChange, isOpen, onClose }: FilterSidebarProps) => {
  const areas = useMemo(() => {
    const areaSet = new Set(cafes.map(c => c.area));
    return Array.from(areaSet).sort();
  }, []);

  const toggleArea = (area: string) => {
    const current = filters.areas;
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    onChange({ ...filters, areas: updated });
  };

  const activeFilterCount = [
    filters.priceRange !== "all",
    filters.minRating > 0,
    filters.wifiOnly,
    filters.openNow,
    filters.areas.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-card border-r border-border z-50
        transition-transform duration-300 lg:translate-x-0 overflow-y-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-foreground">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-accent rounded-lg">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Area / Neighbourhood */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Neighbourhood
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {areas.map(area => {
                const isActive = filters.areas.includes(area);
                const count = cafes.filter(c => c.area === area).length;
                return (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary scale-105"
                        : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {area} <span className="opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
            {filters.areas.length > 0 && (
              <button
                onClick={() => onChange({ ...filters, areas: [] })}
                className="text-xs text-primary hover:underline mt-2"
              >
                Clear areas
              </button>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Price Range</h3>
            <div className="flex flex-col gap-2">
              {priceOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...filters, priceRange: opt.value })}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    filters.priceRange === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Rating</h3>
            <div className="flex flex-col gap-2">
              {ratingOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...filters, minRating: opt.value })}
                  className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                    filters.minRating === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">WiFi Available</span>
              <button
                onClick={() => onChange({ ...filters, wifiOnly: !filters.wifiOnly })}
                className={`w-10 h-6 rounded-full transition-colors ${filters.wifiOnly ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-card shadow transition-transform mx-1 mt-1 ${filters.wifiOnly ? "translate-x-4" : ""}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">Open Now</span>
              <button
                onClick={() => onChange({ ...filters, openNow: !filters.openNow })}
                className={`w-10 h-6 rounded-full transition-colors ${filters.openNow ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-card shadow transition-transform mx-1 mt-1 ${filters.openNow ? "translate-x-4" : ""}`} />
              </button>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
