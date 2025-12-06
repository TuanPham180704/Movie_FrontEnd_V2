import { useState } from "react";
import { userTicketApi } from "../../../api/userTicketApi";

export default function TicketModal({ ticket, onClose, refresh }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await userTicketApi.pay(ticket.id);
      refresh();
      onClose();
    } catch (error) {
      console.error("Thanh toán thất bại", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl max-w-md w-full p-5 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-3">{ticket.movie_title}</h2>
        <img
          src={ticket.poster_url || "/placeholder.png"}
          alt={ticket.movie_title}
          className="w-full h-48 object-cover rounded mb-3"
        />
        <p>
          <strong>Rạp:</strong> {ticket.room_name}
        </p>
        <p>
          <strong>Ghế:</strong> {ticket.seat_number}
        </p>
        <p>
          <strong>Giờ đặt:</strong>{" "}
          {new Date(ticket.booking_date).toLocaleString()}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {ticket.status === "paid"
            ? "Đã Thanh Toán"
            : ticket.status === "pending"
            ? "Chờ Thanh Toán"
            : "Đã Hủy"}
        </p>

        <div className="mt-4 flex justify-center">
          {ticket.status === "paid" ? (
            <div className="p-4 border rounded text-center">
              <p className="mb-2">Quét QR để checkin</p>
              <div className="w-32 h-32 bg-gray-700 flex items-center justify-center">
                QR
              </div>
            </div>
          ) : ticket.status === "pending" ? (
            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            >
              {loading ? "Đang thanh toán..." : "Thanh toán"}
            </button>
          ) : (
            <p className="text-red-500 font-semibold">Vé đã hủy</p>
          )}
        </div>
      </div>
    </div>
  );
}
