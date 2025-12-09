import { useEffect, useState } from "react";
import { booktickets } from "../../api/booktickets";
import { userTicketApi } from "../../api/userTicketApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import MovieInfo from "./Component/MovieInfo";
import CinemaSelect from "./Component/CinemaSelect";
import ShowtimeList from "./Component/ShowtimeList";
import SeatPickerModal from "./Component/SeatPickerModal";
import BookingInfoModal from "./Component/BookingInfoModal";

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

  // Reload ghế sau khi đặt hoặc thanh toán
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

  // Lấy dữ liệu movie, cinema, room, showtime
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

  // Lấy ghế khi chọn room
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

  // Đặt vé
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

      // BE trả về res.tickets = { tickets: [...], group_id, total_price }
      const ticketsArray = res.tickets?.tickets || [];

      const ticketsWithDetails = ticketsArray.map((t) => {
        const seat = seats.find((s) => s.id === t.seat_id);
        const room = rooms.find((r) => r.id === selectedShowtime.room_id);
        return {
          ...t,
          movie_title: movie?.title || "",
          room_name: room?.name || "",
          seat_number: seat?.seat_number || "",
        };
      });

      setBookingInfo({
        seats: ticketsWithDetails,
        status: "pending",
        group_id: res.tickets?.group_id,
        total_price: res.tickets?.total_price,
      });

      setOpenSeatModal(true);
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      toast.error("Đặt vé thất bại!");
    }
  };

  // Thanh toán vé
  const handlePayTicket = async () => {
    if (!bookingInfo || !bookingInfo.seats || bookingInfo.seats.length === 0)
      return;

    try {
      // Thanh toán theo group_id để cập nhật tất cả vé
      const res = await userTicketApi.pay(bookingInfo.group_id);

      await reloadSeats();

      // res.tickets là mảng vé đã thanh toán
      const paidTicketsArray = res.tickets || [];

      const updatedSeats = bookingInfo.seats.map((s) => {
        const updatedTicket = paidTicketsArray.find((t) => t.id === s.id);
        return updatedTicket ? { ...s, status: updatedTicket.status } : s;
      });

      setBookingInfo((prev) => ({
        ...prev,
        seats: updatedSeats,
      }));

      toast.success("Thanh toán thành công!");
      navigate(`/tickets/${bookingInfo.group_id}`);
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
  const showtimesInCinema = showtimes
    .filter((s) => roomsInCinema.some((r) => r.id === s.room_id))
    .filter((s) => Number(s.movie_id) === Number(movieId));

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans text-black">
      {movie && <MovieInfo movie={movie} />}
      <CinemaSelect
        cinemas={cinemas}
        selectedCinema={selectedCinema}
        onSelectCinema={(c) => {
          setSelectedCinema(c);
          setSelectedRoom(null);
          setSelectedShowtime(null);
          setSelectedSeats([]);
          setBookingInfo(null);
          setOpenSeatModal(false);
        }}
      />
      {selectedCinema && (
        <ShowtimeList
          showtimes={showtimesInCinema}
          rooms={rooms}
          roomsInCinema={roomsInCinema}
          selectedShowtime={selectedShowtime}
          onSelectShowtime={handleSelectShowtime}
        />
      )}
      {openSeatModal && selectedRoom && !bookingInfo && (
        <SeatPickerModal
          seats={seats}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
          selectedShowtime={selectedShowtime}
          onBookSeats={handleBookSeats}
          onClose={() => setOpenSeatModal(false)}
          roomName={selectedRoom.name}
          cinemaName={selectedCinema.name}
        />
      )}
      {openSeatModal && bookingInfo && (
        <BookingInfoModal
          bookingInfo={bookingInfo}
          onClose={() => setOpenSeatModal(false)}
          onPayTicket={handlePayTicket}
          onTimeout={handlePaymentTimeout}
        />
      )}
    </div>
  );
}
