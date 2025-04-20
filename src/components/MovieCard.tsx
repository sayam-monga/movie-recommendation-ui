import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Heart, Eye, FileText } from 'lucide-react';
import ReviewDialog from './ReviewDialog';

export interface Movie {
  id: number;
  title: string;
  director: string;
  cast: string[];
  liked?: boolean;
  inWatchlist?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  onToggleLike?: (id: number) => void;
  onToggleWatchlist?: (id: number) => void;
}

const mockReviews = [
  {
    id: 1,
    userId: "user1",
    text: "Great movie, loved the cinematography!",
    rating: 4.5,
    date: "2024-04-15"
  },
  {
    id: 2,
    userId: "user2",
    text: "Interesting plot but could be better paced.",
    rating: 3.8,
    date: "2024-04-14"
  }
];

const MovieCard = ({ movie, onToggleLike, onToggleWatchlist }: MovieCardProps) => {
  const [isLiked, setIsLiked] = useState(movie.liked || false);
  const [inWatchlist, setInWatchlist] = useState(movie.inWatchlist || false);
  const [showReviews, setShowReviews] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onToggleLike) {
      onToggleLike(movie.id);
    }
    toast.success(isLiked ? 'Removed from liked movies' : 'Added to liked movies');
  };

  const handleWatchlist = () => {
    setInWatchlist(!inWatchlist);
    if (onToggleWatchlist) {
      onToggleWatchlist(movie.id);
    }
    toast.success(inWatchlist ? 'Removed from watchlist' : 'Added to watchlist');
  };

  const handleAddReview = () => {
    toast.info('Add review functionality coming soon!');
  };

  return (
    <div className="movie-card flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
      <p className="text-sm text-muted-foreground mb-1">by {movie.director}</p>
      <p className="text-xs text-muted-foreground mb-4">
        Cast: {movie.cast.join(', ')}
      </p>
      
      <div className="flex space-x-2 mb-4 mt-auto">
        <Button 
          onClick={handleLike}
          variant="ghost" 
          size="sm"
          className={`secondary-button flex-1 ${isLiked ? 'bg-primaryAccent' : ''}`}
        >
          <Heart className="w-4 h-4 mr-1" />
          <span className="text-xs">Like</span>
        </Button>
        
        <Button 
          onClick={handleWatchlist}
          variant="ghost" 
          size="sm"
          className={`secondary-button flex-1 ${inWatchlist ? 'bg-primaryAccent' : ''}`}
        >
          <Eye className="w-4 h-4 mr-1" />
          <span className="text-xs">Watchlist</span>
        </Button>
        
        <Button 
          onClick={handleAddReview}
          variant="ghost" 
          size="sm"
          className="secondary-button flex-1"
        >
          <FileText className="w-4 h-4 mr-1" />
          <span className="text-xs">Review</span>
        </Button>
      </div>
      
      <Button 
        onClick={() => setShowReviews(true)}
        variant="ghost" 
        className="secondary-button w-full"
      >
        View Reviews
      </Button>

      <ReviewDialog
        open={showReviews}
        onOpenChange={setShowReviews}
        movieTitle={movie.title}
        reviews={mockReviews}
      />
    </div>
  );
};

export default MovieCard;
