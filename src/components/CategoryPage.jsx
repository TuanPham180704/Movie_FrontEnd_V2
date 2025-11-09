import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { movieApi } from "../api/moiveApi";

export default function CategoryPage() {
  const { slug } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    movieApi.getGenreDetail(slug, 1).then((data) => {
      setMovies(data?.items || []);
    });
  }, [slug]);

  return (
    <div className="bg-black min-h-screen">
      <Section title={`🎭 Thể loại: ${slug}`} movies={movies} />
    </div>
  );
}
