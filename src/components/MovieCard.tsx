import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Star, MessageSquare } from "lucide-react";
import ReviewDialog from "./ReviewDialog";
import { api } from "@/lib/api";

export interface Movie {
  _id: string;
  title: string;
  year: number;
  genres: string[];
  language: string;
  director: string;
  cast: string[];
  platforms: string[];
  poster?: string;
  reviews: {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  liked: boolean;
  inWatchlist: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onToggleLike: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onToggleLike,
  onToggleWatchlist,
}) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(movie.reviews);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No reviews";

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await api.get(`/movies/${movie._id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isReviewDialogOpen) {
      fetchReviews();
    }
  }, [isReviewDialogOpen]);

  const handleWatchlistClick = async () => {
    try {
      await onToggleWatchlist(movie._id);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  const handleLikeClick = async () => {
    try {
      await onToggleLike(movie._id);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <>
      <Card className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-gray-400">No poster available</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="line-clamp-1 text-lg font-semibold text-white">
                {movie.title}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-300">
                  {averageRating}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {movie.genres.map((genre, index) => (
                <span
                  key={index}
                  className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/90"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <p className="text-sm text-white/80">
                  <span className="font-medium text-white/90">Director:</span>{" "}
                  {movie.director}
                </p>
                <p className="text-sm text-white/80">
                  <span className="font-medium text-white/90">Year:</span>{" "}
                  {movie.year}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-full bg-white/10 transition-colors duration-200 ${
                    movie.liked
                      ? "text-red-400 hover:bg-white/20 hover:text-red-300"
                      : "text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                  onClick={handleLikeClick}
                  aria-label={movie.liked ? "Unlike movie" : "Like movie"}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      movie.liked ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-full bg-white/10 transition-colors duration-200 ${
                    movie.inWatchlist
                      ? "text-blue-400 hover:bg-white/20 hover:text-blue-300"
                      : "text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                  onClick={handleWatchlistClick}
                  aria-label={
                    movie.inWatchlist
                      ? "Remove from watchlist"
                      : "Add to watchlist"
                  }
                >
                  <Bookmark
                    className={`h-5 w-5 transition-colors duration-200 ${
                      movie.inWatchlist ? "fill-current" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  onClick={() => setIsReviewDialogOpen(true)}
                  aria-label="View reviews"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <ReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        movieTitle={movie.title}
        movieId={movie._id}
        reviews={reviews}
        onReviewAdded={fetchReviews}
      />
    </>
  );
};

export default MovieCard;
