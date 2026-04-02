import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Coffee, Star, Wifi, Clock } from "lucide-react";
import { cafes, isCafeOpen } from "@/data/cafes";

interface AreaStats {
  name: string;
  count: number;
  avgRating: number;
  openCount: number;
  wifiCount: number;
  topCafe: string;
  image: string;
  priceRange: string;
}

const areaImages: Record<string, string> = {
  "Adyar": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
  "Mylapore": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
  "Besant Nagar": "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop",
  "Anna Nagar": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
  "T. Nagar": "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&fit=crop",
  "Nungambakkam": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
  "OMR": "https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=600&h=400&fit=crop",
  "ECR": "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=400&fit=crop",
  "Velachery": "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
  "Egmore": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  "Royapettah": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&fit=crop",
  "Alwarpet": "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop",
  "Teynampet": "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=600&h=400&fit=crop",
  "Kilpauk": "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=600&h=400&fit=crop",
};

const defaultImage = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop";

const Areas = () => {
  const areaStats = useMemo<AreaStats[]>(() => {
    const areaMap = new Map<string, typeof cafes>();
    cafes.forEach(c => {
      const list = areaMap.get(c.area) || [];
      list.push(c);
      areaMap.set(c.area, list);
    });

    return Array.from(areaMap.entries())
      .map(([name, list]) => {
        const avgRating = +(list.reduce((s, c) => s + c.rating, 0) / list.length).toFixed(1);
        const openCount = list.filter(c => isCafeOpen(c)).length;
        const wifiCount = list.filter(c => c.hasWifi).length;
        const topCafe = list.sort((a, b) => b.rating - a.rating)[0];
        const minP = Math.min(...list.map(c => c.priceMin));
        const maxP = Math.max(...list.map(c => c.priceMax));
        return {
          name,
          count: list.length,
          avgRating,
          openCount,
          wifiCount,
          topCafe: topCafe.name,
          image: areaImages[name] || defaultImage,
          priceRange: `₹${minP}–₹${maxP}`,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, []);

  const totalAreas = areaStats.length;
  const totalCafes = cafes.length;
  const totalOpen = cafes.filter(c => isCafeOpen(c)).length;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Explore by Area
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Browse Cafes by <span className="text-primary">Neighbourhood</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Discover the best cafes across {totalAreas} areas in Chennai
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{totalAreas} Areas</span>
              <span className="flex items-center gap-1.5"><Coffee className="h-4 w-4 text-primary" />{totalCafes} Cafes</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" style={{ color: "hsl(var(--chart-2, 142 71% 45%))" }} />{totalOpen} Open Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* Area Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {areaStats.map((area, i) => (
            <Link
              key={area.name}
              to={`/cafes?area=${encodeURIComponent(area.name)}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 shrink-0" />
                      {area.name}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">{area.count} cafes · {area.priceRange}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warm-gold text-warm-gold" />
                    {area.avgRating}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" style={{ color: "hsl(var(--chart-2, 142 71% 45%))" }} />
                      {area.openCount} open now
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-primary" />
                      {area.wifiCount} with WiFi
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Top rated:</span>{" "}
                    <span className="text-primary">{area.topCafe}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-4">
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

export default Areas;
