import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const imageUrl = movie.poster_url?.startsWith("http")
    ? movie.poster_url
    : `https://phimimg.com/${movie.poster_url}`;

  return (
    <Link
      to={`/movies/${movie.slug}`}
      className="group bg-gray-900 rounded-lg overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-md"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={movie.name}
          className="w-full h-64 object-cover"
          onError={(e) => (e.currentTarget.src = "/notfound.jpg")}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-semibold text-sm truncate group-hover:text-red-400 transition">
            {movie.name}
          </h3>
          <p className="text-gray-400 text-xs">{movie.episode_current}</p>
        </div>
      </div>
    </Link>
  );
}
