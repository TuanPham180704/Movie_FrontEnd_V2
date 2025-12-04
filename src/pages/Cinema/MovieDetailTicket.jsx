import { useEffect, useState } from "react";
import { booktickets } from "../../api/booktickets";
import { userTicketApi } from "../../api/userTicketApi";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

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
  const reloadSeats = async () => {
    if (!selectedRoom) return;
    try {
      const data = await booktickets.getSeatsByRoomId(selectedRoom.id);
      setSeats(data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật ghế!");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, cinemasData, roomsData, showtimesData] =
          await Promise.all([
            booktickets.getMovieById(movieId),
            booktickets.getAllCinemas(),
            booktickets.getAllRooms(),
            booktickets.getUpcoming({ movie_id: movieId }),
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
    if (seat.status !== "available") return;
    setSelectedSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };
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
      await reloadSeats();

      const ticketsWithDetails = res.tickets.map((t) => {
        const seat = seats.find((s) => s.id === t.seat_id);
        const room = rooms.find((r) => r.id === selectedShowtime.room_id);
        return {
          ...t,
          movie_title: movie.title,
          room_name: room?.name || "",
          seat_number: seat?.seat_number || "",
        };
      });

      setBookingInfo({ seats: ticketsWithDetails, status: "pending" });
      setOpenSeatModal(true);
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      toast.error("Đặt vé thất bại!");
    }
  };
  const handlePayTicket = async () => {
    if (!bookingInfo || bookingInfo.seats.length === 0) return;
    try {
      const res = await userTicketApi.pay(bookingInfo.seats[0].id);
      await reloadSeats();
      setBookingInfo((prev) => ({
        ...prev,
        seats: prev.seats.map((s) =>
          s.id === res.ticket.id ? { ...s, status: res.ticket.status } : s
        ),
      }));
      toast.success("Thanh toán thành công!");
      navigate(`/tickets/${res.ticket.id}`);
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
    setSelectedSeats([]);
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  const roomsInCinema = rooms.filter((r) => r.cinema_id === selectedCinema?.id);
  const seatsByRow = {};
  seats.forEach((seat) => {
    const row = seat.seat_number[0];
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push(seat);
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans text-black">
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
                            const isUnavailable =
                              seat.status === "reserved" ||
                              seat.status === "broken";
                            let bg = "",
                              hover = "hover:brightness-105";

                            if (isUnavailable) {
                              bg = "bg-gray-400 cursor-not-allowed";
                              hover = "";
                            } else if (isSelected) {
                              bg = "bg-pink-500 text-white";
                            } else {
                              switch (seat.seat_type) {
                                case "vip":
                                  bg = "bg-red-500 text-white";
                                  break;
                                case "couple":
                                  bg = "bg-pink-200";
                                  break;
                                default:
                                  bg = "bg-purple-400 text-white";
                              }
                            }

                            return (
                              <button
                                key={seat.id}
                                className={`${bg} ${hover} w-10 h-10 rounded text-sm font-semibold transition duration-150 ease-in-out`}
                                onClick={() => toggleSeat(seat)}
                                disabled={isUnavailable}
                                title={
                                  isUnavailable
                                    ? "Ghế đã bán / hỏng"
                                    : `Ghế ${seat.seat_number} - ${seat.seat_type}`
                                }
                              >
                                {seat.seat_number}
                              </button>
                            );
                          })}
                      </div>
                    ))}
                  <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-500 rounded"></div>
                      <span>Đã đặt</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-pink-500 rounded border-2 border-white"></div>
                      <span>Ghế bạn chọn</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-purple-500 rounded"></div>
                      <span>Ghế thường</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded"></div>
                      <span>Ghế VIP</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-pink-300 rounded"></div>
                      <span>Ghế Sweetbox</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-green-500"></div>
                      <span>Vùng trung tâm</span>
                    </div>
                  </div>
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
                <div className="flex flex-col md:flex-row gap-6 items-start border-b pb-4 mb-4">
                  <div className="flex-1 space-y-3 text-black">
                    <h3 className="text-xl font-bold text-red-600 border-b pb-2 mb-2">
                      Vui lòng thanh toán để hoàn tất đặt vé
                    </h3>
                    <p>
                      Phim: <b>{bookingInfo.seats[0].movie_title}</b>
                    </p>
                    <p>
                      Rạp: <b>{bookingInfo.seats[0].room_name}</b>
                    </p>
                    <p>
                      Ghế:{" "}
                      <b>
                        {bookingInfo.seats.map((s) => s.seat_number).join(", ")}
                      </b>
                    </p>
                    <p>
                      Ngày giờ:{" "}
                      <b>{formatDateTime(bookingInfo.seats[0].booking_date)}</b>
                    </p>
                    <p>
                      Trạng thái:{" "}
                      <b className="text-orange-500">
                        {bookingInfo.seats[0].status === "pending"
                          ? "Chờ thanh toán"
                          : bookingInfo.seats[0].status}
                      </b>
                    </p>
                    <p className="text-sm text-gray-500">
                      Mã vé:{" "}
                      <b className="text-gray-800">
                        {bookingInfo.seats.map((s) => s.id).join(", ")}
                      </b>
                    </p>
                    {bookingInfo.seats[0].status === "pending" && (
                      <PaymentCountdown onTimeout={handlePaymentTimeout} />
                    )}
                  </div>

                  <div className="flex-1 flex justify-center items-center w-full md:w-auto">
                    <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
                      <QRCode
                        value={`ticket-${bookingInfo.seats
                          .map((s) => s.id)
                          .join(",")}`}
                        size={180}
                      />
                      <p className="text-center text-xs mt-2 text-gray-500">
                        Quét mã để xác nhận
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-4">
                  {bookingInfo.seats[0].status === "pending" && (
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
