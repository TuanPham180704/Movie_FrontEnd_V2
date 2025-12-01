import { useParams } from "react-router-dom";
import MovieDetailTicket from "../MovieDetailTicket";

function MovieDetailPageWrapper() {
  const { slug } = useParams();
  return <MovieDetailTicket movieId={slug} />;
}

export default MovieDetailPageWrapper;
