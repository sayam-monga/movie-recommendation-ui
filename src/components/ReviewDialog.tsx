import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, Send, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movieTitle: string;
  movieId: string;
  reviews: Review[];
  onReviewAdded?: () => void;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  movieTitle,
  movieId,
  reviews,
  onReviewAdded,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already reviewed this movie
    const userReview = reviews.find(
      (review) => review.user === localStorage.getItem("username")
    );
    if (userReview) {
      setExistingReview(userReview);
      setRating(userReview.rating);
      setComment(userReview.comment);
    } else {
      setExistingReview(null);
      setRating(0);
      setComment("");
    }
  }, [reviews]);

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/movies/${movieId}/reviews`, {
        rating: Number(rating),
        comment: comment.trim(),
      });

      if (response.data) {
        setRating(0);
        setComment("");
        onReviewAdded?.();
        toast({
          title: "Review submitted",
          description: "Your review has been successfully added.",
        });
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      let errorMessage = "Failed to submit review. Please try again later.";

      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Could not connect to the server. Please make sure the backend is running.";
      } else if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Please login to submit a review.";
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (
          error.response.status === 400 &&
          error.response.data.message === "You have already reviewed this movie"
        ) {
          errorMessage = "You have already reviewed this movie.";
          setExistingReview(error.response.data.existingReview);
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Reviews for {movieTitle}
          </DialogTitle>
        </DialogHeader>

        {/* Add Review Section */}
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
          {existingReview ? (
            <div className="text-center py-4">
              <p className="text-white/80 mb-4">
                You have already reviewed this movie
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < existingReview.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/80">{existingReview.comment}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors duration-200 ${
                        star <= rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                rows={3}
                disabled={isSubmitting}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={!rating || !comment.trim() || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-400">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {review.user}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
