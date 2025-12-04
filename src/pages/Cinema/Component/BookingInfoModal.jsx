import QRCode from "react-qr-code";
import PaymentCountdown from "./PaymentCountdown";
import { formatDateTime } from "./PaymentCountdown";

export default function BookingInfoModal({
  bookingInfo,
  onClose,
  onPayTicket,
  onTimeout,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
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
              <b>{bookingInfo.seats.map((s) => s.seat_number).join(", ")}</b>
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
              <PaymentCountdown onTimeout={onTimeout} />
            )}
          </div>

          <div className="flex-1 flex justify-center items-center w-full md:w-auto">
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-md">
              <QRCode
                value={`ticket-${bookingInfo.seats.map((s) => s.id).join(",")}`}
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
              onClick={onPayTicket}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-150"
            >
              Thanh toán ngay
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
