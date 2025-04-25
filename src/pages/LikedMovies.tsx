import { useState, useEffect } from "react";
import MovieCard, { Movie } from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";
import { toast } from "sonner";

const LikedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);
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

      setUserWatchlist(
        watchlistResponse.data.watchlist.map((movie: any) => movie._id)
      );
      const likedMovies = likedResponse.data.likedMovies;

      // Set both liked and watchlist status for liked movies
      const moviesWithStatus = likedMovies.map((movie: any) => ({
        ...movie,
        liked: true,
        inWatchlist: watchlistResponse.data.watchlist.some(
          (watchlist: any) => watchlist._id === movie._id
        ),
      }));

      setMovies(moviesWithStatus);
    } catch (error: any) {
      toast.error("Failed to fetch liked movies");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async (id: string) => {
    try {
      await api.delete("/movies/liked", { data: { movieId: id } });
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
      toast.success("Removed from liked movies");
    } catch (error: any) {
      toast.error("Failed to remove from liked movies");
      console.error("Error removing from liked movies:", error);
    }
  };

  const handleToggleWatchlist = async (id: string) => {
    try {
      const movie = movies.find((m) => m._id === id);
      if (!movie) return;

      if (movie.inWatchlist) {
        await api.delete("/movies/watchlist", { data: { movieId: id } });
        setUserWatchlist((prev) => prev.filter((movieId) => movieId !== id));
      } else {
        await api.post("/movies/watchlist", { movieId: id });
        setUserWatchlist((prev) => [...prev, id]);
      }

      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === id
            ? { ...movie, inWatchlist: !movie.inWatchlist }
            : movie
        )
      );
    } catch (error: any) {
      toast.error("Failed to update watchlist");
      console.error("Error toggling watchlist:", error);
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
          <h1 className="text-3xl font-bold mb-8">My Liked Movies</h1>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                Loading your liked movies...
              </p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                You haven't liked any movies yet.
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

export default LikedMovies;
