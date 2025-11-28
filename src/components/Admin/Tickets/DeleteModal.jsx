export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  ticketLabel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[400px]">
        <h2 className="text-xl font-bold mb-3">Xác nhận xóa</h2>
        <p>
          Bạn có chắc chắn muốn xóa vé:{" "}
          <span className="font-semibold text-red-600">{ticketLabel}</span>?
        </p>

        <div className="flex justify-end space-x-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
