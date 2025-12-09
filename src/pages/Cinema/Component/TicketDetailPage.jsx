import { useEffect, useState } from "react";
import { userTicketApi } from "../../../api/userTicketApi";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { useParams, useNavigate } from "react-router-dom";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return "Ngày giờ không hợp lệ";
  return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString(
    "vi-VN",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
};

const PaymentCountdown = ({ onTimeout, initialTime = 15 * 60 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  useEffect(() => {
    if (timeLeft <= 0) return onTimeout();
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
  const [tickets, setTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchTickets = async () => {
    try {
      const allTickets = await userTicketApi.getAll();
      const groupTickets = allTickets.filter(
        (t) => t.group_id.toString() === ticketId
      );
      if (!groupTickets.length) throw new Error("Không tìm thấy vé!");
      setTickets(groupTickets);

      // Tính tổng tiền từ các vé
      const total = groupTickets.reduce(
        (sum, t) => sum + parseFloat(t.price),
        0
      );
      setTotalPrice(total);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lấy thông tin vé!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [ticketId]);

  const handlePayTicket = async () => {
    if (!tickets.length) return;
    try {
      const group_id = tickets[0].group_id;
      const res = await userTicketApi.pay(group_id);

      // Cập nhật vé sau khi thanh toán
      const updatedTickets = res.ticket?.tickets || tickets;
      setTickets(updatedTickets);

      // Cập nhật tổng tiền (backend trả total_price nếu có)
      const total =
        res.ticket?.total_price ||
        updatedTickets.reduce((sum, t) => sum + parseFloat(t.price), 0);
      setTotalPrice(total);

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
  if (!tickets.length)
    return <p className="text-center mt-10">Không tìm thấy vé.</p>;

  const firstTicket = tickets[0];

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans text-black">
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Chi tiết vé</h1>
        <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-4 mb-4">
          <div className="flex-1 space-y-3 text-black">
            <p>
              Phim: <b>{firstTicket.movie_title}</b>
            </p>
            <p>
              Rạp: <b>{firstTicket.room_name}</b>
            </p>
            <p>
              Ngày giờ: <b>{formatDateTime(firstTicket.booking_date)}</b>
            </p>
            <p>
              Trạng thái:{" "}
              <b
                className={
                  firstTicket.status === "pending"
                    ? "text-orange-500"
                    : "text-green-600"
                }
              >
                {firstTicket.status === "pending"
                  ? "Chờ thanh toán"
                  : firstTicket.status}
              </b>
            </p>
            <p className="text-sm text-gray-500">
              Mã nhóm vé:{" "}
              <b className="text-gray-800">{firstTicket.group_id}</b>
            </p>
            <p className="text-lg font-semibold mt-2">
              Tổng tiền: <b>{totalPrice.toLocaleString()} VND</b>
            </p>

            {firstTicket.status === "pending" && (
              <PaymentCountdown onTimeout={handlePaymentTimeout} />
            )}

            <div>
              <h2 className="font-semibold mt-2">Ghế đã đặt:</h2>
              <ul className="list-disc ml-5">
                {tickets.map((t) => (
                  <li key={t.id}>
                    Ghế {t.seat_number} - Trạng thái:{" "}
                    {t.status === "pending"
                      ? "Chờ thanh toán"
                      : "Đã thanh toán"}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full md:w-auto gap-2">
            <h1 className="text-[20px] font-semibold text-center">
              QR để check-in
            </h1>
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
              <QRCode value={`group-${firstTicket.group_id}`} size={180} />
              <p className="text-center text-xs mt-2 text-gray-500">
                Mã nhóm vé {firstTicket.group_id}
              </p>
            </div>
          </div>
        </div>

        {firstTicket.status === "pending" && (
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
