import React, { useState, useEffect } from "react";

export default function TicketModal({
  isOpen,
  onClose,
  ticketData,
  mode,
  onSubmit,
}) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (ticketData) setStatus(ticketData.status);
  }, [ticketData]);

  if (!isOpen) return null;

  const isView = mode === "view";
  const isEdit = mode === "edit";

  const handleSave = () => {
    onSubmit({ status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5 w-[450px]">
        <h2 className="text-xl font-bold mb-4">
          {isView ? "Chi tiết vé" : "Chỉnh sửa vé"}
        </h2>

        <div className="space-y-2">
          <div>
            <label className="font-semibold">Khách:</label>
            <p>{ticketData?.user_name}</p>
          </div>
          <div>
            <label className="font-semibold">Phim:</label>
            <p>{ticketData?.movie_title}</p>
          </div>
          <div>
            <label className="font-semibold">Ghế:</label>
            <p>{ticketData?.seat_number}</p>
          </div>
          <div>
            <label className="font-semibold">Trạng thái:</label>
            {isView ? (
              <p className="capitalize">{status}</p>
            ) : (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="paid">Thanh toán</option>
                <option value="pending">Chờ xử lý</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Đóng
          </button>

          {!isView && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
