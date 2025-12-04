export default function ShowtimeList({
  showtimes,
  rooms,
  roomsInCinema,
  selectedShowtime,
  onSelectShowtime,
}) {
  return (
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
                onClick={() => onSelectShowtime(s, room)}
              >
                {room.name} - {new Date(s.show_date).toLocaleDateString()}{" "}
                {s.show_time} - {Number(s.ticket_price).toLocaleString()}₫
              </button>
            );
          })}
      </div>
    </section>
  );
}
