import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard, { Movie } from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Search, X } from "lucide-react";

const Dashboard = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [userLikedMovies, setUserLikedMovies] = useState<string[]>([]);
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const moviesPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (
      userLikedMovies.length > 0 ||
      userWatchlist.length > 0 ||
      isLoading === false
    ) {
      fetchMovies();
    }
  }, [userLikedMovies, userWatchlist, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && e.key === "a") {
        e.preventDefault();
        navigate("/admin");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [likedResponse, watchlistResponse] = await Promise.all([
        api.get("/auth/liked"),
        api.get("/auth/watchlist"),
      ]);

      setUserLikedMovies(
        likedResponse.data.likedMovies.map((movie: any) => movie._id)
      );
      setUserWatchlist(
        watchlistResponse.data.watchlist.map((movie: any) => movie._id)
      );
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      const moviesData = response.data;
      const moviesWithStatus = moviesData.map((movie: any) => ({
        ...movie,
        liked: userLikedMovies.includes(movie._id),
        inWatchlist: userWatchlist.includes(movie._id),
      }));
      setMovies(moviesWithStatus);
      setFilteredMovies(moviesWithStatus);

      // Extract unique genres
      const genres = new Set<string>();
      moviesData.forEach((movie: any) => {
        movie.genres.forEach((genre: string) => genres.add(genre));
      });
      setAllGenres([...genres].sort());
    } catch (error: any) {
      toast.error("Failed to fetch movies");
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      if (!query.trim()) {
        fetchMovies();
        return;
      }
      const response = await api.get(
        `/movies/search?q=${encodeURIComponent(query)}`
      );
      const searchResults = response.data;
      setMovies(searchResults);
      setFilteredMovies(searchResults);
      setCurrentPage(1);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to search movies");
      fetchMovies();
    }
  };

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre);
    if (!genre) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
    setCurrentPage(1);
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

      // Update both movies and filteredMovies states
      const updateLikedStatus = (movieList: Movie[]) =>
        movieList.map((movie) =>
          movie._id === id ? { ...movie, liked: !movie.liked } : movie
        );

      setMovies((prevMovies) => updateLikedStatus(prevMovies));
      setFilteredMovies((prevMovies) => updateLikedStatus(prevMovies));
    } catch (error: any) {
      toast.error("Failed to update like status");
      console.error("Error toggling like:", error);
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

      // Update both movies and filteredMovies states
      const updateWatchlistStatus = (movieList: Movie[]) =>
        movieList.map((movie) =>
          movie._id === id
            ? { ...movie, inWatchlist: !movie.inWatchlist }
            : movie
        );

      setMovies((prevMovies) => updateWatchlistStatus(prevMovies));
      setFilteredMovies((prevMovies) => updateWatchlistStatus(prevMovies));
    } catch (error: any) {
      toast.error("Failed to update watchlist");
      console.error("Error toggling watchlist:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Movie Dashboard</h1>

          {/* Search and Filter Section */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search movies by title, genre, director, or year..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-gray-800/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleGenreFilter(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    !selectedGenre
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  All
                </button>
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreFilter(genre)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedGenre === genre
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {/* Gradient fade effect */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">Loading movies...</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                {searchQuery || selectedGenre
                  ? "No movies found. Try a different search term or genre."
                  : "No movies available."}
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

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
