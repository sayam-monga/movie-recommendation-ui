import { useState, useEffect } from "react";
import MovieCard, { Movie } from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";
import { toast } from "sonner";

const Watchlist = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userLikedMovies, setUserLikedMovies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const moviesPerPage = 8;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      // Fetch both liked movies and watchlist in parallel
      const [likedResponse, watchlistResponse] = await Promise.all([
        api.get("/auth/liked"),
        api.get("/auth/watchlist"),
      ]);

      setUserLikedMovies(
        likedResponse.data.likedMovies.map((movie: any) => movie._id)
      );
      const watchlistMovies = watchlistResponse.data.watchlist;

      // Set both liked and watchlist status for watchlist movies
      const moviesWithStatus = watchlistMovies.map((movie: any) => ({
        ...movie,
        liked: likedResponse.data.likedMovies.some(
          (liked: any) => liked._id === movie._id
        ),
        inWatchlist: true,
      }));

      setMovies(moviesWithStatus);
    } catch (error: any) {
      toast.error("Failed to fetch watchlist");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async (id: string) => {
    try {
      const movie = movies.find((m) => m._id === id);
      if (!movie) return;

      if (movie.liked) {
        await api.delete("/movies/liked", { data: { movieId: id } });
        setUserLikedMovies((prev) => prev.filter((movieId) => movieId !== id));
      } else {
        await api.post("/movies/liked", { movieId: id });
        setUserLikedMovies((prev) => [...prev, id]);
      }

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === id ? { ...movie, liked: !movie.liked } : movie
        )
      );
    } catch (error: any) {
      toast.error("Failed to update like status");
      console.error("Error toggling like:", error);
    }
  };

  const handleToggleWatchlist = async (id: string) => {
    try {
      await api.delete("/movies/watchlist", { data: { movieId: id } });
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      toast.success("Removed from watchlist");
    } catch (error: any) {
      toast.error("Failed to remove from watchlist");
      console.error("Error removing from watchlist:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                Loading your watchlist...
              </p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                Your watchlist is empty.
              </p>
            </div>
          ) : (
            <>
              <div className="movie-grid">
                {currentMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onToggleLike={handleToggleLike}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Watchlist;
