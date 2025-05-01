import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/axios";
import MovieCard, { Movie } from "@/components/MovieCard";
import Navbar from "@/components/Navbar";

interface Recommendation {
  movie: Movie;
  score: number;
  reason: string;
}

interface UserPreferences {
  favoriteGenres: string[];
  favoriteDirectors: string[];
  favoriteActors: string[];
  preferredLanguages: string[];
  preferredRuntime: {
    min: number;
    max: number;
  };
  preferredReleaseYears: {
    min: number;
    max: number;
  };
}

const genreOptions = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteGenres: [],
    favoriteDirectors: [],
    favoriteActors: [],
    preferredLanguages: [],
    preferredRuntime: { min: 0, max: 300 },
    preferredReleaseYears: { min: 1900, max: new Date().getFullYear() },
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
    fetchPreferences();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get("/movies/recommendations");
      setRecommendations(response.data);
    } catch (error) {
      toast.error("Failed to fetch recommendations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await api.get("/movies/preferences");
      setPreferences(response.data);
    } catch (error) {
      console.error("Failed to fetch preferences");
    }
  };

  const updatePreferences = async () => {
    try {
      await api.post("/movies/preferences", preferences);
      toast.success("Preferences updated successfully");
      fetchRecommendations(); // Refresh recommendations
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const handleGenreToggle = (genre: string) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };

  const handleToggleLike = async (movieId: string) => {
    try {
      await api.post("/movies/liked", { movieId });
      fetchRecommendations(); // Refresh recommendations
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleToggleWatchlist = async (movieId: string) => {
    try {
      await api.post("/movies/watchlist", { movieId });
      fetchRecommendations(); // Refresh recommendations
    } catch (error) {
      toast.error("Failed to update watchlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-8">Your Movie Recommendations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.movie._id} className="relative">
            <MovieCard
              movie={{
                ...rec.movie,
                liked: false, // This will be updated based on user's liked status
                inWatchlist: false, // This will be updated based on user's watchlist
              }}
              onToggleLike={handleToggleLike}
              onToggleWatchlist={handleToggleWatchlist}
            />
            <div className="mt-2 text-sm text-muted-foreground">
              Recommended because: {rec.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
