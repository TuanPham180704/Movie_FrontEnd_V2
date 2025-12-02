import { useEffect, useState } from "react";
import { userTicketApi } from "../../../api/userTicketApi";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { useParams, useNavigate } from "react-router-dom";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "Ngày giờ không hợp lệ";
  const datePart = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} ${timePart}`;
};
const PaymentCountdown = ({ onTimeout, initialTime = 15 * 60 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`text-xl font-bold p-2 rounded-lg text-center transition duration-500 ${
        minutes < 1
          ? "bg-red-100 text-red-600"
          : "bg-yellow-100 text-yellow-600"
      }`}
    >
      ⏳ Thời gian còn lại: {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTicket = async () => {
    try {
      const data = await userTicketApi.getById(ticketId);
      setTicket(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy thông tin vé!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handlePayTicket = async () => {
    if (!ticket) return;
    try {
      const res = await userTicketApi.pay(ticket.id);
      setTicket(res.ticket);
      toast.success("Thanh toán thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại!");
    }
  };

  const handlePaymentTimeout = () => {
    toast.error("Thời gian thanh toán đã hết!");
    navigate("/");
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!ticket) return <p className="text-center mt-10">Không tìm thấy vé.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans text-black">
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Chi tiết vé</h1>

        <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-4 mb-4">
          <div className="flex-1 space-y-3 text-black">
            <p>
              Phim: <b>{ticket.movie_title}</b>
            </p>
            <p>
              Rạp: <b>{ticket.room_name}</b>
            </p>
            <p>
              Ghế: <b>{ticket.seat_number}</b>
            </p>
            <p>
              Ngày giờ: <b>{formatDateTime(ticket.booking_date)}</b>
            </p>
            <p>
              Trạng thái:{" "}
              <b
                className={
                  ticket.status === "pending"
                    ? "text-orange-500"
                    : "text-green-600"
                }
              >
                {ticket.status === "pending" ? "Chờ thanh toán" : ticket.status}
              </b>
            </p>
            <p className="text-sm text-gray-500">
              Mã vé: <b className="text-gray-800">{ticket.id}</b>
            </p>

            {ticket.status === "pending" && (
              <div className="pt-4">
                <PaymentCountdown onTimeout={handlePaymentTimeout} />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full md:w-auto gap-2">
            <h1 className="text-[20px] font-semibold text-center">
              QR để check-in
            </h1>
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
              <QRCode value={`ticket-${ticket.id}`} size={180} />
              <p className="text-center text-xs mt-2 text-gray-500">
                Quét mã để xác nhận
              </p>
            </div>
          </div>
        </div>

        {ticket.status === "pending" && (
          <div className="flex justify-end gap-4">
            <button
              onClick={handlePayTicket}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-150"
            >
              Thanh toán ngay
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Đóng
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
