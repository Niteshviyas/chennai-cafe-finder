import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from DB when logged in, localStorage when not
  useEffect(() => {
    if (user) {
      setLoading(true);
      supabase
        .from("favorites")
        .select("cafe_id")
        .eq("user_id", user.id)
        .then(({ data }) => {
          setFavorites(data?.map(f => f.cafe_id) || []);
          setLoading(false);
        });
    } else {
      try {
        setFavorites(JSON.parse(localStorage.getItem("cafe-favorites") || "[]"));
      } catch {
        setFavorites([]);
      }
    }
  }, [user]);

  const toggleFavorite = useCallback(async (id: string) => {
    const isFav = favorites.includes(id);

    // Optimistic update
    setFavorites(prev => isFav ? prev.filter(f => f !== id) : [...prev, id]);

    if (user) {
      if (isFav) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("cafe_id", id);
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, cafe_id: id });
      }
    } else {
      const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id];
      localStorage.setItem("cafe-favorites", JSON.stringify(updated));
    }
  }, [favorites, user]);

  return { favorites, toggleFavorite, loading };
};
