import { Star } from "lucide-react";

interface Director {
  id: string;
  name: string;
  rating: number;
  movies: {
    title: string;
    rating: number;
  }[];
}

interface DirectorCardProps {
  director: Director;
}

const DirectorCard = ({ director }: DirectorCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/90" />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {director.name}
          </h2>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold">
              {director.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Top Movies
          </h3>
          <div className="space-y-3">
            {director.movies.map((movie, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3 group-hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-200 font-medium">{movie.title}</span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-300 font-medium">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorCard;
