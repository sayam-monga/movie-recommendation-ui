
import { Movie } from '../components/MovieCard';

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "The Shape of Water",
    director: "Guillermo del Toro",
    cast: ["Sally Hawkins", "Michael Shannon", "Richard Jenkins"],
  },
  {
    id: 2,
    title: "Parasite",
    director: "Bong Joon-ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
  },
  {
    id: 3,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
  },
  {
    id: 4,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
  },
  {
    id: 5,
    title: "The Dark Knight",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
  },
  {
    id: 6,
    title: "Inception",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
  },
  {
    id: 7,
    title: "The Revenant",
    director: "Alejandro González Iñárritu",
    cast: ["Leonardo DiCaprio", "Tom Hardy", "Domhnall Gleeson"],
  },
  {
    id: 8,
    title: "La La Land",
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
  },
  {
    id: 9,
    title: "Joker",
    director: "Todd Phillips",
    cast: ["Joaquin Phoenix", "Robert De Niro", "Zazie Beetz"],
  },
  {
    id: 10,
    title: "1917",
    director: "Sam Mendes",
    cast: ["George MacKay", "Dean-Charles Chapman", "Mark Strong"],
  },
  {
    id: 11,
    title: "Interstellar",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  },
  {
    id: 12,
    title: "The Truman Show",
    director: "Peter Weir",
    cast: ["Jim Carrey", "Laura Linney", "Noah Emmerich"],
  },
  {
    id: 13,
    title: "The Social Network",
    director: "David Fincher",
    cast: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
  },
  {
    id: 14,
    title: "Fight Club",
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
  },
  {
    id: 15,
    title: "Seven",
    director: "David Fincher",
    cast: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow"],
  },
  {
    id: 16,
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
  },
  {
    id: 17,
    title: "Kill Bill: Vol. 1",
    director: "Quentin Tarantino",
    cast: ["Uma Thurman", "Lucy Liu", "Vivica A. Fox"],
  },
  {
    id: 18,
    title: "Inglourious Basterds",
    director: "Quentin Tarantino",
    cast: ["Brad Pitt", "Christoph Waltz", "Michael Fassbender"],
  },
  {
    id: 19,
    title: "Dunkirk",
    director: "Christopher Nolan",
    cast: ["Fionn Whitehead", "Tom Hardy", "Mark Rylance"],
  },
  {
    id: 20,
    title: "Memento",
    director: "Christopher Nolan",
    cast: ["Guy Pearce", "Carrie-Anne Moss", "Joe Pantoliano"],
  }
];

export const mockTopDirectors = [
  {
    id: 1,
    name: "Christopher Nolan",
    rating: 4.8,
    topMovies: mockMovies.filter(movie => movie.director === "Christopher Nolan").slice(0, 3)
  },
  {
    id: 2,
    name: "David Fincher",
    rating: 4.7,
    topMovies: mockMovies.filter(movie => movie.director === "David Fincher").slice(0, 3)
  },
  {
    id: 3,
    name: "Quentin Tarantino",
    rating: 4.6,
    topMovies: mockMovies.filter(movie => movie.director === "Quentin Tarantino").slice(0, 3)
  }
];
