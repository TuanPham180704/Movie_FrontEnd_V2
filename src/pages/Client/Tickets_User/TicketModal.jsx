import { useState } from "react";
import { userTicketApi } from "../../../api/userTicketApi";
import QRCode from "react-qr-code";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#1A1A1A] rounded-xl max-w-md w-full p-5 z-10 shadow-lg">
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
        <div className="mt-4 flex flex-col items-center gap-3">
          {(ticket.status === "paid" || ticket.status === "pending") && (
            <div className="p-4 border rounded text-center bg-[#2A2A2A]">
              <p className="mb-2 font-medium text-gray-200">
                {ticket.status === "paid"
                  ? "Quét QR để checkin"
                  : "QR chờ thanh toán"}
              </p>
              <QRCode
                value={`ticket-${ticket.id}`}
                size={128}
                className="mx-auto"
                bgColor="#1A1A1A"
                fgColor="#ffffff"
              />
            </div>
          )}
          {ticket.status === "pending" && (
            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300"
            >
              {loading ? "Đang thanh toán..." : "Thanh toán"}
            </button>
          )}
          {ticket.status === "cancelled" && (
            <p className="text-red-500 font-semibold">Vé đã hủy</p>
          )}
        </div>
      </div>
    </div>
  );
}
