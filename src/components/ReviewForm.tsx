import { useState } from "react";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  hasExistingReview: boolean;
}

const ReviewForm = ({ onSubmit, hasExistingReview }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-xl p-5 text-center">
        <p className="text-muted-foreground text-sm mb-2">Sign in to leave a review</p>
        <Link to="/login" className="text-primary text-sm font-medium hover:underline">Sign In →</Link>
      </div>
    );
  }

  if (hasExistingReview) {
    return (
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">You've already reviewed this cafe ✓</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (comment.trim().length < 3) { toast.error("Review must be at least 3 characters"); return; }
    if (comment.length > 1000) { toast.error("Review must be under 1000 characters"); return; }

    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/50 rounded-xl p-5 space-y-4">
      <p className="text-sm font-medium text-foreground">Write a Review</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHoverRating(s)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                s <= (hoverRating || rating)
                  ? "fill-warm-gold text-warm-gold"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        {rating > 0 && <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        maxLength={1000}
        className="resize-none"
        rows={3}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{comment.length}/1000</span>
        <Button onClick={handleSubmit} disabled={submitting} size="sm" className="gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
