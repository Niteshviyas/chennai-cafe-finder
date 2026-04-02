import { useState, useRef, useEffect } from "react";
import { Flame, Coffee, Cake, Sandwich, UtensilsCrossed, IceCream, GlassWater, Search, X } from "lucide-react";
import type { MenuItem } from "@/data/cafes";
import { getItemMeta } from "@/utils/menuMeta";

interface CafeMenuProps {
  menu: MenuItem[];
}

interface CategoryDef {
  label: string;
  icon: React.ElementType;
  keywords: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    label: "Coffee & Tea",
    icon: Coffee,
    keywords: ["coffee", "espresso", "latte", "cappuccino", "americano", "mocha", "macchiato", "brew", "cold brew", "tea", "chai", "matcha", "iced tea", "filter coffee", "affogato", "kombucha"],
  },
  {
    label: "Beverages",
    icon: GlassWater,
    keywords: ["smoothie", "juice", "shake", "milkshake", "frappe", "soda", "lemonade", "lassi", "cooler", "mojito", "iced", "hot chocolate"],
  },
  {
    label: "Desserts",
    icon: Cake,
    keywords: ["cake", "brownie", "cookie", "tiramisu", "cheesecake", "pie", "pastry", "muffin", "waffle", "pancake", "donut", "scone", "croissant", "cinnamon roll", "pudding", "tart", "gelato", "ice cream", "sundae", "macarons", "churros", "eclair", "crepe", "truffle", "mousse", "fudge"],
  },
  {
    label: "Snacks",
    icon: Sandwich,
    keywords: ["sandwich", "toast", "fries", "nachos", "bruschetta", "spring roll", "nugget", "finger", "chips", "popcorn", "samosa", "pakora", "tikka", "hummus", "pita", "garlic bread", "quesadilla", "wrap", "roll", "slider", "crostini", "puff", "bun"],
  },
  {
    label: "Meals",
    icon: UtensilsCrossed,
    keywords: ["burger", "pizza", "pasta", "biryani", "rice", "bowl", "salad", "steak", "grilled", "paneer", "chicken", "fish", "egg", "omelette", "noodle", "thali", "curry", "dal", "roti", "naan", "benedict", "risotto", "soup", "club"],
  },
];

function categorizeItems(menu: MenuItem[]): Map<string, MenuItem[]> {
  const categorized = new Map<string, MenuItem[]>();
  const uncategorized: MenuItem[] = [];

  for (const item of menu) {
    const nameLower = item.name.toLowerCase();
    let matched = false;

    for (const cat of CATEGORIES) {
      if (cat.keywords.some((kw) => nameLower.includes(kw))) {
        const existing = categorized.get(cat.label) || [];
        existing.push(item);
        categorized.set(cat.label, existing);
        matched = true;
        break;
      }
    }

    if (!matched) {
      uncategorized.push(item);
    }
  }

  if (uncategorized.length > 0) {
    categorized.set("Specials", uncategorized);
  }

  return categorized;
}

function getCategoryForItem(itemName: string): string {
  const nameLower = itemName.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => nameLower.includes(kw))) {
      return cat.label;
    }
  }
  return "Specials";
}

const CafeMenu = ({ menu }: CafeMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredMenu = searchQuery.trim()
    ? menu.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : menu;
  const categorized = categorizeItems(filteredMenu);
  const categoryNames = Array.from(categorized.keys());
  const [activeCategory, setActiveCategory] = useState(categoryNames[0] || "");
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCategoryIcon = (label: string) => {
    if (label === "Specials") return IceCream;
    return CATEGORIES.find((c) => c.label === label)?.icon || UtensilsCrossed;
  };

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const el = sectionRefs.current.get(cat);
    if (el && scrollContainerRef.current) {
      const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      scrollContainerRef.current.scrollTop += elTop - containerTop - 8;
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let closest = categoryNames[0];
      let closestDist = Infinity;

      for (const name of categoryNames) {
        const el = sectionRefs.current.get(name);
        if (el) {
          const dist = Math.abs(el.getBoundingClientRect().top - containerTop);
          if (dist < closestDist) {
            closestDist = dist;
            closest = name;
          }
        }
      }
      setActiveCategory(closest);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [categoryNames]);

  if (!menu || menu.length === 0) return null;

  const bestSellers = menu.filter((m) => m.bestSeller);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          🍽️ Menu
        </h2>
        <div className="relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu…"
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
          {searchQuery && (
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {filteredMenu.length}
            </span>
          )}
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex min-h-[480px]">
          {/* Left — Category Navigation */}
          <div className="w-44 shrink-0 border-r border-border bg-muted/30 py-3 flex flex-col gap-0.5 overflow-y-auto">
            {bestSellers.length > 0 && (
              <button
                onClick={() => scrollToCategory(categoryNames[0])}
                className="flex items-center gap-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-primary border-b border-border/50 mb-1 pb-3 mx-2"
              >
                <Flame className="h-3.5 w-3.5" />
                {bestSellers.length} Best Sellers
              </button>
            )}

            {categoryNames.map((cat) => {
              const Icon = getCategoryIcon(cat);
              const isActive = activeCategory === cat;
              const count = categorized.get(cat)?.length || 0;

              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-left transition-all duration-200 mx-1 rounded-xl text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                  <span className="truncate">{cat}</span>
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right — Menu Items */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-2 px-4 md:px-6 max-h-[580px]">
            {categoryNames.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Search className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">No items match "{searchQuery}"</p>
              </div>
            )}
            {categoryNames.map((cat) => {
              const items = categorized.get(cat) || [];
              const Icon = getCategoryIcon(cat);

              return (
                <div
                  key={cat}
                  ref={(el) => { if (el) sectionRefs.current.set(cat, el); }}
                  className="mb-6 last:mb-2"
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-3 sticky top-0 bg-card py-2 z-[1]">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {cat}
                    </h3>
                    <div className="flex-1 h-px bg-border ml-2" />
                  </div>

                  {/* Items */}
                  <div className="space-y-0">
                    {items.map((item, idx) => {
                      const meta = getItemMeta(item.name, cat);

                      return (
                        <div key={item.name}>
                          <div className="flex items-start gap-4 py-3.5 px-2 rounded-xl hover:bg-accent/40 transition-colors duration-200 group">
                            {/* Text content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {/* Veg indicator */}
                                <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                                  item.bestSeller ? "border-primary" : "border-emerald-500"
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    item.bestSeller ? "bg-primary" : "bg-emerald-500"
                                  }`} />
                                </div>

                                <span className={`text-sm ${
                                  item.bestSeller ? "font-semibold text-foreground" : "text-foreground"
                                }`}>
                                  {item.name}
                                </span>
                              </div>

                              {item.bestSeller && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-1.5">
                                  <Flame className="h-2.5 w-2.5" /> Best Seller
                                </span>
                              )}

                              <p className="text-xs text-muted-foreground leading-relaxed mb-1.5 line-clamp-2">
                                {meta.description}
                              </p>

                              <span className="text-sm font-bold text-foreground">
                                ₹{item.price}
                              </span>
                            </div>

                            {/* Food image */}
                            <div className="relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] shrink-0 rounded-xl overflow-hidden border border-border/50 group-hover:shadow-md transition-shadow duration-300">
                              <img
                                src={meta.image}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              {item.bestSeller && (
                                <div className="absolute top-1 left-1">
                                  <Flame className="h-3.5 w-3.5 text-primary drop-shadow-sm" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Divider */}
                          {idx < items.length - 1 && (
                            <div className="mx-2 h-px bg-border/40" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeMenu;
