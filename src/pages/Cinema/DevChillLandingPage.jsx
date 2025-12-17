
import { useEffect, useState } from "react";
import { movieTicketApi } from "../../api/movieTicketApi";
import { Link } from "react-router-dom";

export default function DevChillLandingPage() {
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieTicketApi.getAll({ page: 1, limit: 20 });
        setMovies(data.movies || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  const nowShowingMovies = movies.filter((movie) => movie.is_offline === true);
  const comingSoonMovies = movies.filter((movie) => movie.is_offline === false);
  const topComments = [
    {
      user: "Cristiano Ronaldo",
      avatar:
        "https://nld.mediacdn.vn/291774122806476800/2022/11/25/ro-vui-16693114282221777765365.jpg",
      comment:
        "Sau mỗi trận bóng tôi luôn chọn trải nghiệm rạp DevChill để giải trí!",
    },
    {
      user: "Dũng Lại Lập Trình",
      avatar:
        "https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1xyfSW.img?w=768&h=512&m=6&x=2466&y=587&s=368&d=368",
      comment:
        "Một ngày code và dạy học mệt mõi thì chỉ có DevChill làm cho tôi giải tỏa được căng thẳng",
    },
    {
      user: "Trần Hà Linh",
      avatar:
        "https://hinhnen4k.vn/wp-content/uploads/2025/01/anh-tiktoker-tran-ha-linh-cute-6.jpg",
      comment:
        "Mình luôn chọn DevChill cho cuối tuần sau mỗi lần lên mạng nhảy toe toe.",
    },
  ];

  const topMarvelMovies = [
    {
      title: "Avengers: Infinity War",
      poster_url:
        "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    },
    {
      title: "Spider-Man: No Way Home",
      poster_url:
        "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
    },
    {
      title: "Black Panther: Wakanda Forever",
      poster_url:
        "https://cdn.hmv.com/r/w-640/hmv/files/b3/b3ffdfa2-ae01-4a00-848f-1e0deaccbb71.jpg",
    },
  ];

  const blogs = [
    { title: "Top 5 bộ phim không thể bỏ lỡ tháng 11", link: "#" },
    { title: "Hậu trường các bom tấn Marvel", link: "#" },
    { title: "Cách thưởng thức phim tại DevChill đúng chuẩn", link: "#" },
  ];

  const promotions = [
    { title: "Mua 1 tặng 1 vé thứ 4", link: "#" },
    { title: "Combo snack + vé xem phim giá ưu đãi", link: "#" },
  ];

  return (
    <div className="bg-gray-50 font-sans">
      <section
        className="relative h-112 w-full overflow-hidden"
        style={{ backgroundColor: "rgb(241, 228, 234)" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center h-full text-center px-4 md:px-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">
            DevChill Cinema
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-700">
            Trải nghiệm rạp chiếu phim hiện đại, sang trọng và thư giãn.
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto p-10 mt-16 text-black">
        <h2 className="text-3xl font-bold mb-10 text-center">
          🎬 Phim đang chiếu
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải phim...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {(showAll
                ? nowShowingMovies
                : nowShowingMovies.slice(0, visibleCount)
              ).map((movie) => (
                <Link key={movie.id} to={`/movies/tickets/${movie.id}`}>
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:scale-105 transition">
                    <div className="relative">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-80 object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        Đang chiếu
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg line-clamp-1">
                        {movie.title}
                      </h3>
                      <div className="flex justify-between mt-3">
                        <span className="text-purple-600 font-semibold">
                          ⭐ {movie.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.floor(movie.duration / 60)}h{" "}
                          {movie.duration % 60}m
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {nowShowingMovies.length > visibleCount && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-full"
                >
                  {showAll ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <section className="max-w-6xl mx-auto p-10 mt-20 text-black">
        <h2 className="text-3xl font-bold mb-10 text-center">
          🎬 Phim sắp chiếu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {comingSoonMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-3xl shadow-lg opacity-90"
            >
              <div className="relative">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
                <span className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  Sắp chiếu
                </span>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-lg line-clamp-1">
                  {movie.title}
                </h3>
                <button
                  disabled
                  className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
                >
                  Sắp ra mắt
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-10 mt-20 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Top Bình Luận
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topComments.map((c, i) => (
            <div
              key={i}
              className="bg-purple-50 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105 flex gap-4 items-center"
            >
              <img
                src={c.avatar}
                alt={c.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-700 italic">"{c.comment}"</p>
                <p className="mt-2 text-gray-900 font-semibold">- {c.user}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto p-10 mt-20">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Top Phim Hay
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {topMarvelMovies.map((movie, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-10 mt-20 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Blog về Phim Ảnh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((b, i) => (
            <a
              key={i}
              href={b.link}
              className="block bg-purple-50 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <h3 className="font-bold text-lg text-gray-800">{b.title}</h3>
              <p className="text-gray-500 mt-2">Đọc tiếp &rarr;</p>
            </a>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-10 mt-20 bg-white rounded-3xl shadow-xl mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Tin Tức & Khuyến Mãi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((p, i) => (
            <a
              key={i}
              href={p.link}
              className="block bg-purple-50 rounded-xl p-6 shadow hover:shadow-lg transition transform hover:scale-105"
            >
              <h3 className="font-bold text-lg text-gray-800">{p.title}</h3>
              <p className="text-gray-500 mt-2">Xem chi tiết &rarr;</p>
            </a>
          ))}
        </div>
      </section>
      <section className="max-w-5xl mx-auto p-10 mt-20 bg-pink-100 text-black rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Quy Định Rạp DevChill
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 leading-7">
          <div className="space-y-5">
            <p>
              • Đến trước giờ chiếu ít nhất 10 phút để đảm bảo trải nghiệm
              chung.
            </p>
            <p>
              • Không mang đồ nặng mùi, đồ uống có cồn hoặc vật dụng gây ồn vào
              rạp.
            </p>
            <p>• Tuyệt đối không quay phim, ghi âm hay chụp màn hình.</p>
          </div>
          <div className="space-y-5">
            <p>
              • Giữ trật tự, hạn chế nói chuyện và không sử dụng điện thoại phát
              sáng.
            </p>
            <p>• Giữ vệ sinh chung, bỏ rác đúng nơi quy định.</p>
            <p>• Nếu gặp sự cố kỹ thuật, báo ngay nhân viên để được hỗ trợ.</p>
          </div>
        </div>
      </section>

      <div className="mb-2.5">-</div>
    </div>
  );
}
