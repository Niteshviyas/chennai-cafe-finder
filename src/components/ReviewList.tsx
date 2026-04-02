import { Star, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import type { Review } from "@/hooks/useReviews";

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
}

const ReviewList = ({ reviews, loading, onDelete }: ReviewListProps) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-muted/50 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/4 mb-3" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>;
  }

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const name = review.profile?.display_name || "Anonymous";
        const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
        const isOwn = user?.id === review.user_id;

        return (
          <div key={review.id} className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  {review.profile?.avatar_url && <AvatarImage src={review.profile.avatar_url} />}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground text-sm">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-warm-gold text-warm-gold" />
                  ))}
                </div>
                {isOwn && (
                  <button onClick={() => handleDelete(review.id)} className="p-1 rounded hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            <span className="text-xs text-muted-foreground mt-2 block">
              {new Date(review.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
