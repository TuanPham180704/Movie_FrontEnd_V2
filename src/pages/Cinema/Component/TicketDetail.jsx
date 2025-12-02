import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

export default function TicketDetail() {
  const { state } = useLocation();
  const ticket = state?.ticket;
  const [timeLeft, setTimeLeft] = useState(900); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePay = () => {
    alert("Thanh toán thành công!");
  };

  if (!ticket) return <div>Không có vé nào</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết vé</h1>
      <p>Phim: {ticket.movie_title}</p>
      <p>Rạp: {ticket.room_name}</p>
      <p>Ghế: {ticket.seat_numbers.join(", ")}</p>
      <p>
        Suất chiếu: {new Date(ticket.start_time).toLocaleString()} -{" "}
        {new Date(ticket.end_time).toLocaleTimeString()}
      </p>

      <div className="my-4">
        <QRCode value={`TICKET-${ticket.id}`} size={200} />
        <p className="text-center mt-2">
          Hết hạn trong: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
        </p>
      </div>

      <button
        onClick={handlePay}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Thanh toán
      </button>
    </div>
  );
}
