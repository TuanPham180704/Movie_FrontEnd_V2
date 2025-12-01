import { useEffect, useState } from "react";
import { booktickets } from "../../api/booktickets";
import { userTicketApi } from "../../api/userTicketApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

// ------------------------------
// Utils
// ------------------------------
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

// Component countdown 15 phút
const PaymentCountdown = ({ onTimeout }) => {
  const initialTime = 15 * 60;
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

// ------------------------------
// Main Component
// ------------------------------
export default function MovieDetailPage({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [openSeatModal, setOpenSeatModal] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, cinemasData, roomsData, showtimesData] =
          await Promise.all([
            booktickets.getMovieById(movieId),
            booktickets.getAllCinemas(),
            booktickets.getAllRooms(),
            booktickets.getAllShowtimes({ movie_id: movieId }),
          ]);
        setMovie(movieData);
        setCinemas(cinemasData);
        setRooms(roomsData);
        setShowtimes(showtimesData);
      } catch (err) {
        console.error(err);
        toast.error("Lấy dữ liệu thất bại!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  // fetch seats khi chọn room
  useEffect(() => {
    if (!selectedRoom) return setSeats([]);
    const fetchSeats = async () => {
      try {
        const data = await booktickets.getSeatsByRoomId(selectedRoom.id);
        setSeats(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể lấy ghế!");
      }
    };
    fetchSeats();
  }, [selectedRoom]);

  const toggleSeat = (seat) => {
    if (seat.is_sold) return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  // Mua vé (hiển thị thông tin chi tiết pending)
  const handleBookSeats = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      toast.warn("Chọn ghế trước khi mua vé!");
      return;
    }
    try {
      const seatIds = selectedSeats.map((s) => s.id);
      const res = await userTicketApi.book({
        showtime_id: selectedShowtime.id,
        seat_ids: seatIds,
      });
      setBookingInfo(res);
    } catch (err) {
      console.error(err);
      toast.error("Đặt vé thất bại!");
    }
  };

  const handlePayTicket = async () => {
    if (!bookingInfo) return;
    try {
      const res = await userTicketApi.pay(bookingInfo.id);
      toast.success("Thanh toán thành công!");
      navigate(`/ticket/${bookingInfo.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại!");
    }
  };

  const handleSelectShowtime = (showtime, room) => {
    setSelectedShowtime(showtime);
    setSelectedRoom(room);
    setSelectedSeats([]);
    setBookingInfo(null);
    setOpenSeatModal(true);
  };

  const handlePaymentTimeout = () => {
    toast.error("Thời gian thanh toán đã hết! Vui lòng đặt lại vé.");
    setOpenSeatModal(false);
    setBookingInfo(null);
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  const roomsInCinema = rooms.filter((r) => r.cinema_id === selectedCinema?.id);

  // --- Chuẩn bị sơ đồ ghế theo hàng (A,B,C...) ---
  const seatsByRow = {};
  seats.forEach((seat) => {
    const row = seat.seat_number[0]; // A, B, C
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push(seat);
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans text-black">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Movie info */}
      {movie && (
        <section className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full md:w-1/3 rounded-2xl object-cover"
            />
            <div className="flex-1 flex flex-col gap-4">
              <h1 className="text-4xl font-bold text-gray-800">
                {movie.title}
              </h1>
              <p className="text-gray-600 italic">
                {movie.category.split(",").join(" | ")}
              </p>
              <p className="text-gray-700">{movie.description}</p>
              <div className="flex gap-4 items-center mt-4">
                <span className="text-purple-600 font-semibold text-lg">
                  ⭐ {movie.rating}
                </span>
                <span className="text-gray-600">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chọn rạp */}
      <section className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Chọn rạp</h2>
        <select
          className="border p-2 rounded-lg w-64 text-blue-600"
          value={selectedCinema?.id || ""}
          onChange={(e) => {
            const c = cinemas.find((c) => c.id === Number(e.target.value));
            setSelectedCinema(c);
            setSelectedRoom(null);
            setSelectedShowtime(null);
            setSelectedSeats([]);
            setBookingInfo(null);
            setOpenSeatModal(false);
          }}
        >
          <option value="">-- Chọn rạp --</option>
          {cinemas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </section>

      {/* Suất chiếu */}
      {selectedCinema && (
        <section className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Suất chiếu</h2>
          <div className="flex flex-wrap gap-4">
            {showtimes
              .filter((s) => roomsInCinema.some((r) => r.id === s.room_id))
              .map((s) => {
                const room = rooms.find((r) => r.id === s.room_id);
                return (
                  <button
                    key={s.id}
                    className={`px-4 py-2 border rounded-lg bg-white text-black hover:bg-gray-100 ${
                      selectedShowtime?.id === s.id
                        ? "border-purple-600 ring-2 ring-purple-600 font-semibold"
                        : ""
                    }`}
                    onClick={() => handleSelectShowtime(s, room)}
                  >
                    {room.name} - {new Date(s.show_date).toLocaleDateString()}{" "}
                    {s.show_time} - {Number(s.ticket_price).toLocaleString()}₫
                  </button>
                );
              })}
          </div>
        </section>
      )}

      {/* Modal ghế & chi tiết vé */}
      {openSeatModal && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
              {bookingInfo
                ? "Chi tiết vé"
                : `Chọn ghế - ${selectedRoom.name} (${selectedCinema.name})`}
            </h2>

            {!bookingInfo ? (
              <>
                {/* Chọn ghế */}
                <div className="text-center mb-4 text-gray-700">
                  <div className="p-2 border-b-4 border-gray-600 inline-block mb-4 w-3/4 font-semibold">
                    Màn hình
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.keys(seatsByRow)
                    .sort()
                    .map((row) => (
                      <div key={row} className="flex gap-2 justify-center">
                        {seatsByRow[row]
                          .sort(
                            (a, b) =>
                              parseInt(a.seat_number.slice(1)) -
                              parseInt(b.seat_number.slice(1))
                          )
                          .map((seat) => {
                            const isSelected = selectedSeats.some(
                              (s) => s.id === seat.id
                            );
                            let bg = "bg-pink-200 hover:bg-pink-300";
                            let hover = "hover:bg-pink-300";
                            if (seat.is_sold) {
                              bg = "bg-gray-400 cursor-not-allowed";
                              hover = "";
                            }
                            if (isSelected) {
                              bg =
                                "bg-purple-600 text-white hover:bg-purple-700";
                              hover = "hover:bg-purple-700";
                            }
                            return (
                              <button
                                key={seat.id}
                                className={`${bg} ${hover} w-10 h-10 rounded text-sm font-semibold transition duration-150 ease-in-out`}
                                onClick={() => toggleSeat(seat)}
                                disabled={seat.is_sold}
                                title={
                                  seat.is_sold
                                    ? "Ghế đã bán"
                                    : `Ghế ${seat.seat_number}`
                                }
                              >
                                {seat.seat_number}
                              </button>
                            );
                          })}
                      </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between items-center border-t pt-4">
                  <p className="text-lg font-bold text-gray-800">
                    Tổng cộng: {selectedSeats.length} vé (
                    {(
                      selectedSeats.length *
                      Number(selectedShowtime?.ticket_price || 0)
                    ).toLocaleString()}
                    ₫)
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleBookSeats}
                      disabled={selectedSeats.length === 0}
                      className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-150 ${
                        selectedSeats.length > 0
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Mua vé
                    </button>
                    <button
                      onClick={() => setOpenSeatModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Chi tiết vé pending */}
                <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-4 mb-4">
                  <div className="flex-1 space-y-3 text-black">
                    <h3 className="text-xl font-bold text-red-600 border-b pb-2 mb-2">
                      Vui lòng thanh toán để hoàn tất đặt vé
                    </h3>
                    <p>
                      Phim: <b>{bookingInfo.movie_title}</b>
                    </p>
                    <p>
                      Rạp: <b>{bookingInfo.room_name}</b>
                    </p>
                    <p>
                      Ghế: <b>{bookingInfo.seat_number}</b>
                    </p>
                    <p>
                      Ngày giờ:{" "}
                      <b>{formatDateTime(bookingInfo.booking_date)}</b>
                    </p>
                    <p>
                      Trạng thái:{" "}
                      <b className="text-orange-500">
                        {bookingInfo.status === "pending"
                          ? "Chờ thanh toán"
                          : bookingInfo.status}
                      </b>
                    </p>
                    <p className="text-sm text-gray-500">
                      Mã vé: <b className="text-gray-800">{bookingInfo.id}</b>
                    </p>
                    {bookingInfo.status === "pending" && (
                      <div className="pt-4">
                        <PaymentCountdown onTimeout={handlePaymentTimeout} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex justify-center items-center w-full md:w-auto">
                    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                      <QRCode value={`ticket-${bookingInfo.id}`} size={180} />
                      <p className="text-center text-xs mt-2 text-gray-500">
                        Quét mã để xác nhận
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  {bookingInfo.status === "pending" && (
                    <button
                      onClick={handlePayTicket}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-150"
                    >
                      Thanh toán ngay
                    </button>
                  )}
                  <button
                    onClick={() => setOpenSeatModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
