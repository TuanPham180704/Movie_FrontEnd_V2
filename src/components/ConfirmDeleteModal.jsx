
export default function ConfirmDeleteModal({
  isOpen,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa?",
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-3">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="px-5 py-3 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
