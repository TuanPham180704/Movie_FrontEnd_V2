import { useEffect, useState } from "react";
import { roomApi } from "../../api/roomApi";
import { cinemaApi } from "../../api/cinemaApi";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import RoomModal from "../../components/Admin/Room/RoomModal";
import ConfirmDeleteModal from "../../components/Admin/ConfirmDeleteModal";
import { toast } from "react-toastify";
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchRooms = async () => {
    try {
      const data = await roomApi.getAll();
      setRooms(data || []);
      setFilteredRooms(data || []);
    } catch {
      toast.error("Lỗi tải danh sách phòng!");
    }
  };

  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.getAll();
      setCinemas(data || []);
    } catch {
      toast.error("Lỗi tải danh sách rạp!");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchCinemas();
  }, []);
  useEffect(() => {
    let result = [...rooms];
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(term) ||
          r.cinema_name?.toLowerCase().includes(term)
      );
    }
    if (cinemaFilter !== "all") {
      result = result.filter((r) => r.cinema_id == cinemaFilter);
    }

    setFilteredRooms(result);
    setCurrentPage(1);
  }, [searchTerm, cinemaFilter, rooms]);
  const handleCreate = () => {
    setSelectedRoom(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitRoom = async (data) => {
    try {
      if (modalMode === "create") await roomApi.create(data);
      else await roomApi.update(selectedRoom.id, data);

      toast.success("Lưu phòng thành công!");
      setIsModalOpen(false);
      fetchRooms();
    } catch {
      toast.error("Lỗi khi lưu phòng!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await roomApi.delete(selectedRoom.id);
      toast.success("Xóa phòng thành công!");
      setIsDeleteModalOpen(false);
      fetchRooms();
    } catch {
      toast.error("Xóa phòng thất bại!");
    }
  };
  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const pageData = filteredRooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Quản Lý Phòng Chiếu</h1>
        <div className="flex items-center gap-3">
          <select
            value={cinemaFilter}
            onChange={(e) => setCinemaFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="all">Tất cả rạp</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-10 py-2 w-72 focus:border-black"
            />
          </div>
          <ExportCSV
            data={filteredRooms}
            fileName="rooms"
            fields={["id", "name", "cinema_name", "seat_layout", "created_at"]}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <AiOutlinePlus />
            Thêm phòng
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-gray-700">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Tên phòng</th>
                <th className="p-3 border">Rạp</th>
                <th className="p-3 border">Layout</th>
                <th className="p-3 border">Ngày tạo</th>
                <th className="p-3 border text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có phòng nào.
                  </td>
                </tr>
              ) : (
                pageData.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{room.id}</td>
                    <td className="p-3 font-medium">{room.name}</td>
                    <td className="p-3">{room.cinema_name}</td>
                    <td className="p-3">
                      {room.seat_layout.rows} x {room.seat_layout.cols}
                    </td>
                    <td className="p-3">
                      {room.created_at
                        ? new Date(room.created_at).toLocaleString()
                        : "--"}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-3 text-lg">
                        <button
                          onClick={() => handleView(room)}
                          className="text-gray-600 hover:text-black"
                        >
                          <AiOutlineEye />
                        </button>

                        <button
                          onClick={() => handleEdit(room)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiOutlineEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(room)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t py-4 flex justify-center bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <RoomModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedRoom}
        onSubmit={handleSubmitRoom}
        onClose={() => setIsModalOpen(false)}
        cinemas={cinemas}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Xóa phòng"
        message={`Bạn muốn xóa phòng "${selectedRoom?.name}" ?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
