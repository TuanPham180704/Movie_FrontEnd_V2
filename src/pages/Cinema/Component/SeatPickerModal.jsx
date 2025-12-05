export default function SeatPickerModal({
  seats,
  selectedSeats,
  toggleSeat,
  selectedShowtime,
  onBookSeats,
  onClose,
  roomName,
  cinemaName,
}) {
  const seatsByRow = {};
  seats.forEach((seat) => {
    const row = seat.seat_number[0];
    if (!seatsByRow[row]) seatsByRow[row] = [];
    seatsByRow[row].push(seat);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">
          Chọn ghế - {roomName} ({cinemaName})
        </h2>

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
                      seat.status === "reserved" || seat.status === "broken";
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
              selectedSeats.length * Number(selectedShowtime?.ticket_price || 0)
            ).toLocaleString()}
            ₫)
          </p>
          <div className="flex gap-4">
            <button
              onClick={onBookSeats}
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
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
