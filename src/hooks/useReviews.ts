import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  cafe_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profile?: { display_name: string | null; avatar_url: string | null };
}

export const useReviews = (cafeId: string) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);

    const { data: reviewData } = await supabase
      .from("reviews")
      .select("*")
      .eq("cafe_id", cafeId)
      .order("created_at", { ascending: false });

    if (!reviewData || reviewData.length === 0) {
      setReviews([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for review authors
    const userIds = [...new Set(reviewData.map((r) => r.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .in("user_id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url }])
    );

    const enriched: Review[] = reviewData.map((r) => ({
      ...r,
      profile: profileMap.get(r.user_id) || undefined,
    }));

    setReviews(enriched);
    setLoading(false);
  }, [cafeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (rating: number, comment: string) => {
    if (!user) throw new Error("Must be logged in");
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      cafe_id: cafeId,
      rating,
      comment: comment.trim(),
    });
    if (error) throw error;
    await fetchReviews();
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) throw error;
    await fetchReviews();
  };

  const userReview = reviews.find((r) => r.user_id === user?.id);

  return { reviews, loading, addReview, deleteReview, userReview, refetch: fetchReviews };
};
