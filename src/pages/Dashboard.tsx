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
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [userLikedMovies, setUserLikedMovies] = useState<string[]>([]);
  const [userWatchlist, setUserWatchlist] = useState<string[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const moviesPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [likedRes, watchlistRes, moviesRes] = await Promise.all([
          api.get("/auth/liked"),
          api.get("/auth/watchlist"),
          api.get("/movies"),
        ]);

        const likedIds = likedRes.data.likedMovies.map((m: any) => m._id);
        const watchlistIds = watchlistRes.data.watchlist.map((m: any) => m._id);

        setUserLikedMovies(likedIds);
        setUserWatchlist(watchlistIds);

        const allMovies = moviesRes.data.map((movie: any) => ({
          ...movie,
          liked: likedIds.includes(movie._id),
          inWatchlist: watchlistIds.includes(movie._id),
        }));

        setMovies(allMovies);
        setFilteredMovies(allMovies);

        const genres = new Set<string>();
        allMovies.forEach((m: any) =>
          m.genres.forEach((g: string) => genres.add(g))
        );
        setAllGenres([...genres].sort());
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "a") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    if (!query.trim()) {
      setFilteredMovies(movies);
      return;
    }

    try {
      const res = await api.get(
        `/movies/search?q=${encodeURIComponent(query)}`
      );
      const results = res.data.map((movie: any) => ({
        ...movie,
        liked: userLikedMovies.includes(movie._id),
        inWatchlist: userWatchlist.includes(movie._id),
      }));
      setFilteredMovies(results);
      setCurrentPage(1);
    } catch (err) {
      toast.error("Search failed");
      console.error(err);
      setFilteredMovies(movies);
    }
  };

  const handleGenreFilter = (genre: string | null) => {
    setSelectedGenre(genre);
    setSearchQuery("");
    const filtered = genre
      ? movies.filter((m) => m.genres.includes(genre))
      : movies;
    setFilteredMovies(filtered);
    setCurrentPage(1);
  };

  const toggleMovieField = (
    field: "liked" | "inWatchlist",
    id: string,
    action: "add" | "remove"
  ) => {
    const update = (list: Movie[]) =>
      list.map((m) => (m._id === id ? { ...m, [field]: action === "add" } : m));
    setMovies((prev) => update(prev));
    setFilteredMovies((prev) => update(prev));
  };

  const handleToggleLike = async (id: string) => {
    const liked = userLikedMovies.includes(id);
    try {
      if (liked) {
        await api.delete("/movies/liked", { data: { movieId: id } });
        setUserLikedMovies((prev) => prev.filter((i) => i !== id));
        toggleMovieField("liked", id, "remove");
      } else {
        await api.post("/movies/liked", { movieId: id });
        setUserLikedMovies((prev) => [...prev, id]);
        toggleMovieField("liked", id, "add");
      }
    } catch (err) {
      toast.error("Failed to toggle like");
      console.error(err);
    }
  };

  const handleToggleWatchlist = async (id: string) => {
    const inWatchlist = userWatchlist.includes(id);
    try {
      if (inWatchlist) {
        await api.delete("/movies/watchlist", { data: { movieId: id } });
        setUserWatchlist((prev) => prev.filter((i) => i !== id));
        toggleMovieField("inWatchlist", id, "remove");
      } else {
        await api.post("/movies/watchlist", { movieId: id });
        setUserWatchlist((prev) => [...prev, id]);
        toggleMovieField("inWatchlist", id, "add");
      }
    } catch (err) {
      toast.error("Failed to toggle watchlist");
      console.error(err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Movie Dashboard</h1>

          <div className="mb-12 space-y-6">
            <div className="relative max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => handleGenreFilter(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedGenre === genre
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
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
