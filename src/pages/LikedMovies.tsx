
import { useState, useEffect } from 'react';
import MovieCard, { Movie } from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { mockMovies } from '@/data/mockData';

const LikedMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // Simulate fetching liked movies
  useEffect(() => {
    // In a real app, this would come from an API or context
    const likedMovies = mockMovies
      .slice(5, 12) // Just use a different set of movies for demo
      .map(movie => ({ ...movie, liked: true }));
    
    setMovies(likedMovies);
  }, []);

  const handleToggleLike = (id: number) => {
    setMovies(prevMovies => 
      prevMovies.filter(movie => movie.id !== id)
    );
  };

  const handleToggleWatchlist = (id: number) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, inWatchlist: !movie.inWatchlist } : movie
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Calculate total pages
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  
  // Get current movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Liked Movies</h1>
          
          {movies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">You haven't liked any movies yet.</p>
            </div>
          ) : (
            <>
              <div className="movie-grid">
                {currentMovies.map(movie => (
                  <MovieCard 
                    key={movie.id} 
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
