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
        setMovies(data.movies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const topComments = [
    {
      user: "Cristiano Ronaldo",
      avatar:
        "https://nld.mediacdn.vn/291774122806476800/2022/11/25/ro-vui-16693114282221777765365.jpg",
      comment:
        "Sau mỗi trận bóng tôi luôn chọn trải nghiệm rạp DevChill để giải trí!",
    },
    {
      user: "Nguyễn Thị Lan Anh",
      avatar:
        "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/493528231_1331875951407585_6656477031045095356_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHRyrrvQfff9vcZ7KpTrj4Tzcpn61WPKDPNymfrVY8oM3EjhHhfl1QZJra4eM-_sfYqsuAEGkYKYS-AbrsLkser&_nc_ohc=S7t0moIQMKUQ7kNvwEyewsB&_nc_oc=Adm89DTfSX_VHP-FjHt4e-qJBKkDjfnyKNVOXlN8Z5LR1tjpZfhFRUqd_NAH2eGbf59AjOsHPPCkessMINAz-jM8&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=A5ze8kJdIMuihwLTgGhDvg&oh=00_AfhIiK68gy0lajU1J0vh1GlqA-eTLD4ESp9Ink6I0UNseA&oe=693232FD",
      comment: "Ghế êm, âm thanh sống động, không gian đẹp!",
    },
    {
      user: "Trần Hà Linh",
      avatar:
        "https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/540450845_1472881710415213_8508038144623935236_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEIwboGSGGezTLEYcx6YvFNnE0VmfxZRBacTRWZ_FlEFvLx0XD8rvN9x4n2oxZmr5X5Rsvh6fcAITbe20v30aL4&_nc_ohc=V2HVfaNbvkMQ7kNvwG0TOnw&_nc_oc=AdlsQni4IjfqTFCTK0EvsC4DvS8j9i0jJT-pvLsGy2HAZiiYueYc3a5Ce2lewK9uf-bWswgHzd3wSJ_neKWll0Ue&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=hmUByvn0rFW8JcMzdFe5nQ&oh=00_AfgH41IAZISa5qsr-9OPtstvYm-oxPtoClmeLaIePtrqTg&oe=69322EA0",
      comment: "Mình luôn chọn DevChill cho cuối tuần.",
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
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-lg animate-fadeIn">
            DevChill Cinema
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-700 drop-shadow-md animate-fadeIn delay-200">
            Trải nghiệm rạp chiếu phim hiện đại, sang trọng và thư giãn.
          </p>
          <button className="mt-8 px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105 animate-fadeIn delay-400">
            Xem phim ngay
          </button>
        </div>
      </section>
      <section className="max-w-6xl mx-auto p-10 mt-16">
        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          Phim đang chiếu
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải phim...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {(showAll ? movies : movies.slice(0, visibleCount)).map(
                (movie) => (
                  <Link key={movie.id} to={`/movies/tickets/${movie.id}`}>
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                      <div className="relative">
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-full h-80 object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-purple-600 text-white font-semibold px-3 py-1 rounded-full text-sm">
                          {movie.category.split(",")[0]}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        <h3 className="font-bold text-lg text-gray-800 hover:text-purple-600 transition line-clamp-1">
                          {movie.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-1">
                          {movie.category.split(",").join(" | ")}
                        </p>
                        <div className="flex items-center justify-between border-t pt-3">
                          <span className="text-purple-600 font-semibold text-lg">
                            ⭐ {movie.rating}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {Math.floor(movie.duration / 60)}h{" "}
                            {movie.duration % 60}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>

            {movies.length > 4 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105"
                >
                  {showAll ? "Ẩn bớt" : "Xem thêm"}
                </button>
              </div>
            )}
          </>
        )}
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
