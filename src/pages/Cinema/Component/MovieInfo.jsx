export default function MovieInfo({ movie }) {
  return (
    <section className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-2xl object-cover"
        />
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-gray-800">{movie.title}</h1>
          <p className="text-gray-600 italic">
            {movie.category.split(",").join(" | ")}
          </p>
          <p className="text-gray-700">{movie.description}</p>
          <div className="flex gap-4 items-center mt-4">
            <span className="text-purple-600 font-semibold text-lg">
              ⭐ {movie.rating}
            </span>
            <span className="text-gray-600">
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
