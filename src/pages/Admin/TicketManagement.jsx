import { useEffect, useState } from "react";
import { ticketApi } from "../../api/ticketApi";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import TicketTable from "../../components/Admin/Tickets/TicketTable";
import TicketModal from "../../components/Admin/Tickets/TicketModal";
import ConfirmDeleteModal from "../../components/Admin/ConfirmDeleteModal";
import { toast } from "react-toastify";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchTickets = async () => {
    try {
      const data = await ticketApi.getAll();
      setTickets(data);
      setFilteredTickets(data);
    } catch (err) {
      toast.error("Lỗi tải vé");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = tickets.filter(
      (t) =>
        t.user_name?.toLowerCase().includes(term) ||
        t.movie_title?.toLowerCase().includes(term) ||
        t.seat_number?.toLowerCase().includes(term) ||
        t.room_name?.toLowerCase().includes(term) ||
        t.status?.toLowerCase().includes(term)
    );

    setFilteredTickets(filtered);
    setCurrentPage(1);
  }, [searchTerm, tickets]);

  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setModalMode("view");
    setIsTicketModalOpen(true);
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setModalMode("edit");
    setIsTicketModalOpen(true);
  };

  const handleDelete = (ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitTicket = async (data) => {
    try {
      await ticketApi.update(selectedTicket.id, data);
      toast.success("Cập nhật vé thành công!");
      setIsTicketModalOpen(false);
      fetchTickets();
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await ticketApi.delete(selectedTicket.id);
      toast.success("Xóa vé thành công!");
      setIsDeleteModalOpen(false);
      fetchTickets();
    } catch (err) {
      toast.error("Xóa vé thất bại!");
    }
  };

  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Quản Lý Đặt Vé</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm phim, tên khách, ghế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-72"
          />

          <ExportCSV
            data={filteredTickets}
            fileName="tickets"
            fields={[
              "id",
              "user_name",
              "movie_title",
              "room_name",
              "seat_number",
              "status",
              "booking_date",
              "show_date",
              "show_time",
            ]}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <TicketTable
            tickets={paginatedTickets}
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

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticketData={selectedTicket}
        mode={modalMode}
        onSubmit={handleSubmitTicket}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Xóa Vé"
        message={`Bạn muốn xóa vé "${selectedTicket?.movie_title}" - Ghế ${selectedTicket?.seat_number}?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
