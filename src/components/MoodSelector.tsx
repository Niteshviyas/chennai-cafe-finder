import { useState } from "react";
import { cafes } from "@/data/cafes";
import CafeCard from "@/components/CafeCard";
import type { Cafe } from "@/data/cafes";

interface Mood {
  emoji: string;
  label: string;
  tags: string[];
}

const moods: Mood[] = [
  { emoji: "💻", label: "Work", tags: ["Best for Work", "WiFi Available", "Coworking", "Quiet"] },
  { emoji: "❤️", label: "Romantic", tags: ["Romantic Spot", "Garden Seating", "Outdoor", "Sunset Views"] },
  { emoji: "😌", label: "Chill", tags: ["Cozy", "Quiet", "Heritage", "Pet Friendly"] },
  { emoji: "👥", label: "Hangout", tags: ["Student Hangout", "Rooftop", "Live Music", "Hookah"] },
  { emoji: "☕", label: "Coffee Lover", tags: ["Specialty Coffee", "Filter Coffee", "Traditional"] },
  { emoji: "🔥", label: "Top Rated", tags: ["Must Visit", "Premium"] },
];

interface MoodSelectorProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userRatings: Record<string, { avg: number; count: number }>;
}

const MoodSelector = ({ favorites, onToggleFavorite, userRatings }: MoodSelectorProps) => {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const matchedCafes: Cafe[] = activeMood
    ? cafes.filter((cafe) => {
        const mood = moods.find((m) => m.label === activeMood);
        if (!mood) return false;
        if (activeMood === "Top Rated") {
          return cafe.rating >= 4.5 || mood.tags.some((tag) => cafe.tags.includes(tag));
        }
        return mood.tags.some((tag) => cafe.tags.includes(tag));
      })
    : [];

  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
        🎭 Find Cafes by Your Mood
      </h2>
      <p className="text-sm text-muted-foreground mb-5">Select a mood and we'll find the perfect spot for you</p>

      <div className="flex flex-wrap gap-2.5 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => setActiveMood(activeMood === mood.label ? null : mood.label)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              activeMood === mood.label
                ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-accent"
            }`}
          >
            <span className="text-lg">{mood.emoji}</span>
            {mood.label}
          </button>
        ))}
      </div>

      {activeMood && matchedCafes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
          {matchedCafes.map((cafe) => (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              isFavorite={favorites.includes(cafe.id)}
              onToggleFavorite={onToggleFavorite}
              userRating={userRatings[cafe.id]}
            />
          ))}
        </div>
      )}

      {activeMood && matchedCafes.length === 0 && (
        <p className="text-muted-foreground text-sm">No cafes match this mood yet.</p>
      )}
    </section>
  );
};

export default MoodSelector;
