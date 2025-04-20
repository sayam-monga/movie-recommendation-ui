
import { Movie } from './MovieCard';

interface Director {
  id: number;
  name: string;
  rating: number;
  topMovies: Movie[];
}

interface DirectorCardProps {
  director: Director;
}

const DirectorCard = ({ director }: DirectorCardProps) => {
  return (
    <div className="card mb-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{director.name}</h3>
        <div className="flex items-center bg-input px-3 py-1 rounded-full">
          <span className="text-[#FFD700] mr-1">⭐</span>
          <span className="font-semibold">{director.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Movies:</h4>
      <ul className="space-y-2">
        {director.topMovies.map((movie) => (
          <li key={movie.id} className="bg-input rounded-md p-3">
            <p className="font-medium">{movie.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Cast: {movie.cast.join(', ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectorCard;
