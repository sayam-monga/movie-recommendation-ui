import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DirectorCard from "@/components/DirectorCard";
import api from "@/lib/axios";
import { toast } from "sonner";

interface Director {
  _id: string;
  avgRating: number;
  movies: {
    title: string;
    rating: number;
  }[];
}

const TopDirectors = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopDirectors();
  }, []);

  const fetchTopDirectors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/movies/directors/top");
      setDirectors(response.data);
    } catch (error) {
      console.error("Error fetching top directors:", error);
      toast.error("Failed to fetch top directors");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Top Rated Directors</h1>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                Loading directors...
              </p>
            </div>
          ) : directors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-muted-foreground">
                No directors found.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {directors.map((director) => (
                <DirectorCard
                  key={director._id}
                  director={{
                    id: director._id,
                    name: director._id,
                    rating: director.avgRating,
                    movies: director.movies || [],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopDirectors;
