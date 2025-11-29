import { useEffect, useState } from "react";
import { showtimeApi } from "../../api/showtimeApi";
import { movieApiAdmin } from "../../api/movie_apiadmin";
import { roomApi } from "../../api/roomApi";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import ShowtimeTable from "../../components/Admin/Showtime/ShowtimeTable";
import ShowtimeModal from "../../components/Admin/Showtime/ShowtimeModal";
import ConfirmDeleteModal from "../../components/Admin/ConfirmDeleteModal";
import { toast } from "react-toastify";

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchShowtimes = async () => {
    try {
      const data = await showtimeApi.getAll();
      setShowtimes(data);
      setFilteredShowtimes(data);
    } catch (err) {
      toast.error("Lỗi tải suất chiếu");
    }
  };

  const fetchMoviesRooms = async () => {
    try {
      const moviesData = await movieApiAdmin.getAll();
      setMovies(moviesData.movies || []);
      const roomsData = await roomApi.getAll();
      setRooms(roomsData);
    } catch (err) {
      toast.error("Lỗi tải phim hoặc phòng");
    }
  };

  useEffect(() => {
    fetchShowtimes();
    fetchMoviesRooms();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = showtimes.filter(
      (s) =>
        s.movie_title?.toLowerCase().includes(term) ||
        s.room_name?.toLowerCase().includes(term) ||
        s.cinema_name?.toLowerCase().includes(term) ||
        s.show_date?.includes(term) ||
        s.show_time?.includes(term)
    );
    setFilteredShowtimes(filtered);
    setCurrentPage(1);
  }, [searchTerm, showtimes]);

  const handleView = (showtime) => {
    setSelectedShowtime(showtime);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (showtime) => {
    setSelectedShowtime(showtime);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedShowtime(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleDelete = (showtime) => {
    setSelectedShowtime(showtime);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitShowtime = async (data) => {
    try {
      if (modalMode === "add") {
        await showtimeApi.create(data);
        toast.success("Tạo suất chiếu thành công!");
      } else if (modalMode === "edit") {
        await showtimeApi.update(selectedShowtime.id, data);
        toast.success("Cập nhật suất chiếu thành công!");
      }
      setIsModalOpen(false);
      fetchShowtimes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Thao tác thất bại!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await showtimeApi.delete(selectedShowtime.id);
      toast.success("Xóa suất chiếu thành công!");
      setIsDeleteModalOpen(false);
      fetchShowtimes();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const totalPages = Math.ceil(filteredShowtimes.length / pageSize);
  const paginatedShowtimes = filteredShowtimes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Quản Lý Suất Chiếu</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm phim, rạp, phòng, ngày..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-72"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Thêm suất chiếu
          </button>
          <ExportCSV
            data={filteredShowtimes}
            fileName="showtimes"
            fields={[
              "movie_title",
              "cinema_name",
              "room_name",
              "show_date",
              "show_time",
              "ticket_price",
            ]}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ShowtimeTable
            showtimes={paginatedShowtimes}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="border-t py-3 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ShowtimeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showtimeData={selectedShowtime}
        movies={movies}
        rooms={rooms}
        mode={modalMode}
        onSubmit={handleSubmitShowtime}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Xóa Suất Chiếu"
        message={`Bạn có chắc muốn xóa suất chiếu "${selectedShowtime?.movie_title}" - ${selectedShowtime?.cinema_name} / ${selectedShowtime?.room_name} ?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
