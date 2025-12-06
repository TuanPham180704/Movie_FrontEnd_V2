export default function TicketItem({ ticket, onViewDetails }) {
  return (
    <div
      className="flex border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer bg-[#1F1F1F]"
      onClick={() => onViewDetails(ticket)}
    >
      <img
        src={ticket.poster_url || "/placeholder.png"}
        alt={ticket.movie_title}
        className="w-24 md:w-32 object-cover"
      />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg">{ticket.movie_title}</h3>
          <p className="text-sm text-gray-400">{ticket.room_name}</p>
          <p className="text-sm text-gray-400">
            {new Date(ticket.booking_date).toLocaleString()} -{" "}
            {ticket.seat_number}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              ticket.status === "paid"
                ? "bg-green-100 text-green-800"
                : ticket.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {ticket.status === "paid"
              ? "Đã Thanh Toán"
              : ticket.status === "pending"
              ? "Chờ Thanh Toán"
              : "Đã Hủy"}
          </span>
          <button
            className="text-yellow-400 text-sm font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(ticket);
            }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
