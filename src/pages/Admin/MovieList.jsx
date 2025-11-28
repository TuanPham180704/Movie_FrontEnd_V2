import { useEffect, useState } from "react";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../api/movie_apiadmin";
import MovieModal from "../../components/Admin/Movie/MovieModal";
import ConfirmDeleteModal from "../../components/Admin/Movie/ConfirmDeleteModal";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlinePlus,
} from "react-icons/ai";
import { toast } from "react-toastify";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Load movies từ API
  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data.movies || []);
      setFilteredMovies(data.movies || []);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải danh sách phim!");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Client-side search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = movies.filter(
      (m) =>
        m.title?.toLowerCase().includes(term) ||
        m.category?.toLowerCase().includes(term)
    );
    setFilteredMovies(filtered);
    setCurrentPage(1); // reset page khi search
  }, [searchTerm, movies]);

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / pageSize);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
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

  const csvData = filteredMovies.map((m) => ({
    title: m.title,
    category: m.category,
    duration: m.duration,
    status: m.is_offline ? "Đang chiếu" : "Sắp chiếu",
    rating: m.rating,
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Quản Lí Phim</h1>
      <p className="text-gray-500 mb-4">
        Quản lý phim chiếu tại các cụm rạp trên toàn quốc
      </p>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          className="border rounded px-3 py-2 w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <AiOutlinePlus /> Thêm phim
          </button>
          <ExportCSV
            data={csvData}
            fields={["title", "category", "duration", "status", "rating"]}
            fileName="DanhSachPhim"
          />
        </div>
      </div>

      <div className="bg-white rounded shadow flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-gray-600 text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 w-24 text-center">Poster</th>
                <th className="px-4 py-2">Tên phim</th>
                <th className="px-4 py-2 w-32">Thể loại</th>
                <th className="px-4 py-2 w-28">Thời lượng</th>
                <th className="px-4 py-2 text-center w-32">Trạng thái</th>
                <th className="px-4 py-2 text-center w-24">Đánh giá</th>
                <th className="px-4 py-2 text-center w-32">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovies.length > 0 ? (
                paginatedMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded border mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{movie.title}</td>
                    <td className="px-4 py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {movie.category}
                      </span>
                    </td>
                    <td className="px-4 py-2">{movie.duration} phút</td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          movie.is_offline
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {movie.is_offline ? "Đang chiếu" : "Sắp chiếu"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-bold text-yellow-500">
                      {movie.rating} ⭐
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="inline-flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(movie)}
                          className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                          title="Xem chi tiết"
                        >
                          <AiOutlineEye />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100"
                          title="Sửa"
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(movie)}
                          className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          title="Xóa"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Không tìm thấy phim nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t py-3 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {modalOpen && (
        <MovieModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          movie={selectedMovie}
          readOnly={readOnly}
        />
      )}

      {deleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
