import { useState, useEffect } from 'react';
import MovieCard, { Movie } from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import Navbar from '@/components/Navbar';
import { mockMovies } from '@/data/mockData';

const Dashboard = () => {
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(mockMovies);
  const moviesPerPage = 8;

  const handleSearch = (query: string) => {
    const searchTerm = query.toLowerCase();
    if (!searchTerm) {
      setFilteredMovies(mockMovies);
    } else {
      const filtered = mockMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.cast.some(actor => actor.toLowerCase().includes(searchTerm))
      );
      setFilteredMovies(filtered);
    }
    setCurrentPage(1);
  };

  const handleToggleLike = (id: number) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, liked: !movie.liked } : movie
      )
    );
    
    setFilteredMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, liked: !movie.liked } : movie
      )
    );
  };

  const handleToggleWatchlist = (id: number) => {
    setMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, inWatchlist: !movie.inWatchlist } : movie
      )
    );
    
    setFilteredMovies(prevMovies => 
      prevMovies.map(movie => 
        movie.id === id ? { ...movie, inWatchlist: !movie.inWatchlist } : movie
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className="page-container">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Movie Dashboard</h1>
          
          {filteredMovies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">No movies found. Try a different search term.</p>
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
