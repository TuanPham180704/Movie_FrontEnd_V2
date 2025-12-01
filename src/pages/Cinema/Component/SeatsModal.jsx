import { useState } from "react";

export default function SeatsModal({ seats, room, onClose }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;
    setSelectedSeats((prev) =>
      prev.includes(seat.seat_number)
        ? prev.filter((s) => s !== seat.seat_number)
        : [...prev, seat.seat_number]
    );
  };

  // Nhóm ghế theo hàng
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.seat_number[0];
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Room: {room.name}</h2>
        <div className="mb-4">
          {Object.keys(rows).map((row) => (
            <div key={row} className="flex mb-2">
              {rows[row].map((seat) => (
                <button
                  key={seat.id}
                  className={`w-10 h-10 m-1 rounded ${
                    seat.status === "available"
                      ? selectedSeats.includes(seat.seat_number)
                        ? "bg-green-500"
                        : "bg-gray-200 hover:bg-gray-300"
                      : "bg-red-500 cursor-not-allowed"
                  }`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat.seat_number}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => alert("Selected seats: " + selectedSeats.join(", "))}
          >
            Mua
          </button>
        </div>
      </div>
    </div>
  );
}
