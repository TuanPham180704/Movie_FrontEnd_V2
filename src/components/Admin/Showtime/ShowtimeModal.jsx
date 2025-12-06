import { useState, useEffect } from "react";

export default function ShowtimeModal({
  isOpen,
  onClose,
  showtimeData,
  movies,
  rooms,
  mode,
  onSubmit,
}) {
  const [form, setForm] = useState({
    movie_id: "",
    room_id: "",
    show_date: "",
    show_time: "",
    ticket_price: "",
  });

  useEffect(() => {
    if (showtimeData) {
      setForm({
        movie_id: showtimeData.movie_id,
        room_id: showtimeData.room_id,
        show_date: showtimeData.show_date?.slice(0, 10) || "",
        show_time: showtimeData.show_time || "",
        ticket_price: showtimeData.ticket_price || "",
      });
    } else {
      setForm({
        movie_id: "",
        room_id: "",
        show_date: "",
        show_time: "",
        ticket_price: "",
      });
    }
  }, [showtimeData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (
      !form.movie_id ||
      !form.room_id ||
      !form.show_date ||
      !form.show_time ||
      !form.ticket_price
    ) {
      return alert("Vui lòng điền đầy đủ thông tin");
    }
    if (Number(form.ticket_price) < 0) return alert("Giá vé không được âm");

    onSubmit({ ...form, ticket_price: Number(form.ticket_price) });
  };

  if (!isOpen) return null;

  const selectedRoom = rooms.find((r) => r.id === Number(form.room_id));
  const soldSeats = showtimeData?.soldSeats ?? 0;
  const totalSeats = showtimeData?.totalSeats ?? 0;
  const occupancy =
    totalSeats > 0 ? ((soldSeats / totalSeats) * 100).toFixed(1) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "view"
            ? "Xem suất chiếu"
            : mode === "add"
            ? "Thêm suất chiếu"
            : "Sửa suất chiếu"}
        </h2>
        <div className="flex flex-col space-y-2 mb-4">
          <label>Phim</label>
          {mode === "view" ? (
            <span>
              {movies.find((m) => m.id === Number(form.movie_id))?.title}
            </span>
          ) : (
            <select
              name="movie_id"
              value={form.movie_id}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Chọn phim</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          <label>Phòng / Rạp</label>
          {mode === "view" ? (
            <span>
              {selectedRoom?.cinema_name} / {selectedRoom?.name}
            </span>
          ) : (
            <select
              name="room_id"
              value={form.room_id}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Chọn phòng</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.cinema_name} / {r.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          <label>Ngày chiếu</label>
          <input
            type="date"
            name="show_date"
            value={form.show_date}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          <label>Giờ chiếu</label>
          <input
            type="time"
            name="show_time"
            value={form.show_time}
            onChange={handleChange}
            disabled={mode === "view"}
            className="border p-2 rounded"
          />
        </div>
        {mode === "view" && (
          <div className="flex flex-col space-y-2 mb-4">
            <label>Giờ kết thúc</label>
            <span>{showtimeData?.end_time}</span>
          </div>
        )}
        {mode === "view" && (
          <div className="flex flex-col space-y-2 mb-4">
            <label>Tình trạng ghế</label>
            <span>
              Đã bán: <b>{soldSeats}</b> / {totalSeats} (<b>{occupancy}%</b>)
            </span>
          </div>
        )}
        <div className="flex flex-col space-y-2 mb-4">
          <label>Giá vé</label>
          {mode === "view" ? (
            <span>{form.ticket_price} ₫</span>
          ) : (
            <input
              type="number"
              name="ticket_price"
              value={form.ticket_price}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Đóng
          </button>
          {mode !== "view" && (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {mode === "add" ? "Thêm" : "Cập nhật"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
