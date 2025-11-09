import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import { movieApi } from "../api/moiveApi";
export default function MovieList() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);
  const keyword = (query.get("keyword") || "").trim();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        if (keyword) {
          const res = await movieApi.search(keyword, page);
          let items = [];
          let tp = 1;
          if (Array.isArray(res)) {
            items = res;
            tp = 1;
          } else if (res) {
            items = res.items || res.result || res.data || [];
            tp =
              res.totalPages ||
              res.total_pages ||
              res.pagination?.totalPages ||
              1;
            if (!Array.isArray(items) && items) items = [items];
          }

          if (!cancelled) {
            setMovies(items);
            setTotalPages(tp || 1);
          }
          return;
        }
        let data;
        if (location.pathname.includes("/movies/genres/")) {
          data = await movieApi.getGenreDetail(slug, page);
        } else if (location.pathname.includes("/movies/countries/")) {
          data = await movieApi.getCountryDetail(slug, page);
        } else if (location.pathname.includes("/movies/years/")) {
          data = await movieApi.getMoviesByYear(slug, page);
        } else if (location.pathname.includes("/movies/list/phim-bo")) {
          data = await movieApi.getList("phim-bo", page);
        } else if (location.pathname.includes("/movies/list/phim-le")) {
          data = await movieApi.getList("phim-le", page);
        } else if (location.pathname.includes("/movies/list/hoat-hinh")) {
          data = await movieApi.getList("hoat-hinh", page);
        } else {
          data = await movieApi.getNew(page);
        }

        const items = data?.items || data?.data?.items || data?.result || [];
        const total =
          data?.pagination?.totalPages ||
          data?.data?.params?.pagination?.totalPages ||
          data?.totalPages ||
          data?.total_pages ||
          1;

        if (!cancelled) {
          setMovies(Array.isArray(items) ? items : []);
          setTotalPages(total || 1);
        }
      } catch (error) {
        console.error("Lỗi tải phim:", error);
        if (!cancelled) {
          setMovies([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [slug, page, location.pathname, keyword]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("page", String(page));
    if (keyword) params.set("keyword", keyword);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [page]);

  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => {
      const start = Math.max(1, page - 2);
      return start + i <= totalPages ? start + i : totalPages - 4 + i;
    }
  ).filter((p) => p > 0 && p <= totalPages);

  return (
    <div className="bg-gray-950 text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {keyword
            ? `Kết quả tìm kiếm: "${keyword}"`
            : slug
            ? slug.replaceAll("-", " ")
            : "Danh sách phim"}
        </h1>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
              {movies.map((movie) => (
                <MovieCard
                  key={movie._id || movie.slug || movie.id}
                  movie={movie}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <>
                <div className="flex justify-center mt-10 space-x-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    ← Trước
                  </button>

                  {pageNumbers.map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`px-3 py-2 rounded ${
                        num === page
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Sau →
                  </button>
                </div>

                <div className="text-center text-gray-400 mt-4">
                  Trang {page} / {totalPages}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-20 text-lg">
            {keyword
              ? `Không tìm thấy kết quả nào cho từ khóa “${keyword}”`
              : "Không có phim."}
          </div>
        )}
      </div>
    </div>
  );
}
