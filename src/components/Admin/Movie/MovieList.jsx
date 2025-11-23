import { useEffect, useState } from "react";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../../api/movie_apiadmin";
import MovieModal from "./MovieModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlinePlus,
  AiOutlineSearch,
} from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho toast

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]); // State cho tìm kiếm client-side tạm thời
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [readOnly, setReadOnly] = useState(false);

  // Hàm lấy danh sách phim
  const fetchMovies = async () => {
    try {
      // Nếu API hỗ trợ search thì truyền searchTerm vào đây
      const data = await getMovies(1, 20, searchTerm);
      setMovies(data.movies || []); // Fallback array rỗng nếu data null
      setFilteredMovies(data.movies || []);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải danh sách phim!");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []); // Reload khi component mount

  // Xử lý tìm kiếm (Client-side filter nếu API chưa hỗ trợ search)
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const results = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerTerm) ||
        movie.category.toLowerCase().includes(lowerTerm)
    );
    setFilteredMovies(results);
  }, [searchTerm, movies]);

  const handleAdd = () => {
    setSelectedMovie(null);
    setReadOnly(false);
    setModalOpen(true);
  };

  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setReadOnly(false);
    setModalOpen(true);
  };

  const handleView = (movie) => {
    setSelectedMovie(movie);
    setReadOnly(true);
    setModalOpen(true);
  };

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedMovie) {
        await updateMovie(selectedMovie.id, formData);
        toast.success("Cập nhật phim thành công!");
      } else {
        await createMovie(formData);
        toast.success("Thêm phim mới thành công!");
      }
      setModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMovie(selectedMovie.id);
      toast.success("Đã xóa phim thành công!");
      setDeleteModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa phim!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header & Search & Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Phim</h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Thanh tìm kiếm */}
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <AiOutlineSearch size={20} />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium whitespace-nowrap"
            >
              <AiOutlinePlus size={18} /> Thêm phim
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center w-24">Poster</th>
                <th className="px-4 py-3">Tên phim</th>
                <th className="px-4 py-3 w-32">Thể loại</th>
                <th className="px-4 py-3 w-28">Thời lượng</th>
                <th className="px-4 py-3 text-center w-32">Trạng thái</th>
                <th className="px-4 py-3 text-center w-24">Đánh giá</th>
                <th className="px-4 py-3 text-center w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-center align-middle">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded border border-gray-300 shadow-sm mx-auto"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 align-middle">
                      {movie.title}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {movie.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      {movie.duration} phút
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          movie.is_offline
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {movie.is_offline ? "Đang chiếu" : "Sắp chiếu"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center align-middle font-bold text-yellow-500">
                      {movie.rating} ⭐
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleView(movie)}
                          className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                          title="Xem chi tiết"
                        >
                          <AiOutlineEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition"
                          title="Sửa"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(movie)}
                          className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                          title="Xóa"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Không tìm thấy phim nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MovieModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        movie={selectedMovie}
        readOnly={readOnly}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
