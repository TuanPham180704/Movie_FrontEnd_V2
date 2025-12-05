import { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import { MdEventSeat } from "react-icons/md";

export default function ShowtimeList({
  showtimes,
  rooms,
  roomsInCinema,
  selectedShowtime,
  onSelectShowtime,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());

  const getNext7Days = () => {
    const arr = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  };

  const days = getNext7Days();
  const weekdayMap = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  const getWeekday = (d) => weekdayMap[d.getDay()];

  const filteredShowtimes = showtimes.filter((s) => {
    const showDate = new Date(s.show_date).toDateString();
    return (
      showDate === selectedDate && roomsInCinema.some((r) => r.id === s.room_id)
    );
  });

  return (
    <section className="max-w-6xl mx-auto mt-8 p-8 bg-white rounded-3xl shadow-xl border border-pink-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-pink-700">
        <FiCalendar className="text-pink-600" /> Suất chiếu
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
        {days.map((d, index) => {
          const dayNum = d.getDate();
          const isToday = index === 0;
          const isSelected = selectedDate === d.toDateString();

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(d.toDateString())}
              className={`cursor-pointer min-w-[70px] px-4 py-3 rounded-xl border text-center transition-all
                ${
                  isSelected
                    ? "bg-pink-600 text-white border-pink-600 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <div className="text-xl font-bold">{dayNum}</div>
              <div className="text-sm opacity-90">
                {isToday ? "Hôm nay" : getWeekday(d)}
              </div>
            </div>
          );
        })}
      </div>
      {filteredShowtimes.length === 0 ? (
        <p className="text-pink-600 font-medium text-base mt-5 bg-pink-50 py-3 px-4 rounded-xl border border-pink-200">
          DevChill hiện tại không có suất chiếu trong thời gian này 🎟️
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {filteredShowtimes.map((s) => {
            const room = rooms.find((r) => r.id === s.room_id);

            return (
              <button
                key={s.id}
                onClick={() => onSelectShowtime(s, room)}
                className={`text-left p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all
                    ${
                      selectedShowtime?.id === s.id
                        ? "border-pink-600 ring-2 ring-pink-300"
                        : "border-gray-200"
                    }`}
              >
                <div className="text-lg font-bold mb-1 flex items-center gap-2">
                  <MdEventSeat className="text-pink-600" />
                  {room?.name}
                </div>

                <div className="text-gray-600 text-sm flex items-center gap-1">
                  <FiCalendar />{" "}
                  {new Date(s.show_date).toLocaleDateString("vi-VN")}
                </div>

                <div className="text-gray-600 text-sm flex items-center gap-1">
                  <FiClock /> {s.show_time} → {s.end_time}
                </div>

                <div className="mt-2 text-pink-700 font-semibold flex items-center gap-1">
                  <FiDollarSign />{" "}
                  {Number(s.ticket_price).toLocaleString("vi-VN")}₫
                </div>

                <div className="mt-3 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-1">
                    🎟 Ghế đã đặt: <b>{s.soldSeats}</b>
                  </div>
                  <div className="flex items-center gap-1">
                    💺 Tổng ghế: <b>{s.totalSeats}</b>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
