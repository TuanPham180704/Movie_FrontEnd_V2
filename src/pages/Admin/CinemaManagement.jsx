import { useEffect, useState } from "react";
import { cinemaApi } from "../../api/cinemaApi";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import CinemaModal from "../../components/Admin/Cinema/CinemaModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { toast } from "react-toastify";

import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";

export default function CinemaManagement() {
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);

  const [selectedCinema, setSelectedCinema] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch all cinemas
  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.getAll();
      setCinemas(data || []);
      setFilteredCinemas(data || []);
    } catch (err) {
      toast.error("Lỗi tải rạp!");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  // Realtime search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = cinemas.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term) ||
        c.address?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term)
    );
    setFilteredCinemas(filtered);
    setCurrentPage(1);
  }, [searchTerm, cinemas]);

  // ACTIONS
  const handleCreate = () => {
    setSelectedCinema(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleView = (cinema) => {
    setSelectedCinema(cinema);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (cinema) => {
    setSelectedCinema(cinema);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (cinema) => {
    setSelectedCinema(cinema);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitCinema = async (formData) => {
    try {
      if (modalMode === "create") {
        await cinemaApi.create(formData);
      } else {
        // Merge old data with new form data to avoid missing fields
        const updatedData = { ...selectedCinema, ...formData };
        await cinemaApi.update(selectedCinema.id, updatedData);
      }

      toast.success("Lưu rạp thành công!");
      setIsModalOpen(false);
      fetchCinemas();
    } catch (err) {
      toast.error("Lỗi khi lưu rạp!");
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await cinemaApi.delete(selectedCinema.id);
      toast.success("Xóa rạp thành công!");
      setIsDeleteModalOpen(false);
      fetchCinemas();
    } catch (err) {
      toast.error("Xóa rạp thất bại!");
      console.error(err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredCinemas.length / pageSize);
  const pageData = filteredCinemas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
        <h1 className="text-2xl font-bold">Quản Lý Rạp Phim</h1>

        <div className="flex gap-2 items-center">
          <div className="relative">
            <AiOutlineSearch className="absolute left-2 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm rạp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 pl-8 rounded w-72"
            />
          </div>

          <ExportCSV
            data={filteredCinemas}
            fileName="cinemas"
            fields={["id", "name", "address", "city", "phone", "created_at"]}
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <AiOutlinePlus size={18} />
            Thêm Rạp
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="p-3 border border-gray-300">ID</th>
                <th className="p-3 border border-gray-300">Tên rạp</th>
                <th className="p-3 border border-gray-300">Địa chỉ</th>
                <th className="p-3 border border-gray-300">Thành phố</th>
                <th className="p-3 border border-gray-300">SĐT</th>
                <th className="p-3 border border-gray-300">Ngày tạo</th>
                <th className="p-3 border border-gray-300 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-5 text-gray-500">
                    Không có rạp nào.
                  </td>
                </tr>
              ) : (
                pageData.map((cinema) => (
                  <tr
                    key={cinema.id}
                    className="hover:bg-gray-100 transition border-b border-gray-300"
                  >
                    <td className="p-3">{cinema.id}</td>
                    <td className="p-3 font-medium truncate max-w-[180px]">
                      {cinema.name}
                    </td>
                    <td className="p-3 truncate max-w-[220px]">
                      {cinema.address}
                    </td>
                    <td className="p-3">{cinema.city}</td>
                    <td className="p-3">{cinema.phone}</td>
                    <td className="p-3">
                      {cinema.created_at
                        ? new Date(cinema.created_at).toLocaleString()
                        : "--"}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center gap-3 text-[18px]">
                        <button
                          onClick={() => handleView(cinema)}
                          className="text-gray-600 hover:text-black"
                        >
                          <AiOutlineEye />
                        </button>
                        <button
                          onClick={() => handleEdit(cinema)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cinema)}
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

        <div className="border-t py-3 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <CinemaModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedCinema}
        onSubmit={handleSubmitCinema}
        onClose={() => setIsModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Xóa rạp"
        message={`Bạn chắc muốn xóa rạp "${selectedCinema?.name}" ?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
