import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAverageRatings = () => {
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number }>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("reviews").select("cafe_id, rating");
      if (!data) return;

      const map: Record<string, { sum: number; count: number }> = {};
      for (const r of data) {
        if (!map[r.cafe_id]) map[r.cafe_id] = { sum: 0, count: 0 };
        map[r.cafe_id].sum += r.rating;
        map[r.cafe_id].count += 1;
      }

      const result: Record<string, { avg: number; count: number }> = {};
      for (const [id, v] of Object.entries(map)) {
        result[id] = { avg: Math.round((v.sum / v.count) * 10) / 10, count: v.count };
      }
      setRatings(result);
    };
    fetch();
  }, []);

  return ratings;
};
