import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState({
    title: "",
    director: "",
    year: "",
    genre: "",
    cast: "",
    rating: "",
    description: "",
    poster: "",
    platforms: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert comma-separated strings to arrays
      const movie = {
        ...movieData,
        genre: movieData.genre.split(",").map((g) => g.trim()),
        cast: movieData.cast.split(",").map((c) => c.trim()),
        platforms: movieData.platforms.split(",").map((p) => p.trim()),
        year: parseInt(movieData.year),
        rating: parseFloat(movieData.rating),
      };

      await api.post("/movies", movie);
      toast.success("Movie added successfully!");
      setMovieData({
        title: "",
        director: "",
        year: "",
        genre: "",
        cast: "",
        rating: "",
        description: "",
        poster: "",
        platforms: "",
      });
    } catch (error) {
      toast.error("Failed to add movie");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Add New Movie</h2>
          <p className="mt-2 text-gray-400">Enter movie details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={movieData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="director"
                className="block text-sm font-medium text-gray-300"
              >
                Director
              </label>
              <input
                type="text"
                name="director"
                id="director"
                required
                value={movieData.director}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-300"
              >
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                required
                value={movieData.year}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-300"
              >
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                id="rating"
                required
                value={movieData.rating}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="genre"
                className="block text-sm font-medium text-gray-300"
              >
                Genre (comma-separated)
              </label>
              <input
                type="text"
                name="genre"
                id="genre"
                required
                value={movieData.genre}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="cast"
                className="block text-sm font-medium text-gray-300"
              >
                Cast (comma-separated)
              </label>
              <input
                type="text"
                name="cast"
                id="cast"
                required
                value={movieData.cast}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="platforms"
                className="block text-sm font-medium text-gray-300"
              >
                Platforms (comma-separated)
              </label>
              <input
                type="text"
                name="platforms"
                id="platforms"
                required
                value={movieData.platforms}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="poster"
                className="block text-sm font-medium text-gray-300"
              >
                Poster URL
              </label>
              <input
                type="text"
                name="poster"
                id="poster"
                required
                value={movieData.poster}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              value={movieData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
