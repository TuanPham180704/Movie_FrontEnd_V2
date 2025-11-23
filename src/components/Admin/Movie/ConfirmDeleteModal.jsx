import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
        <AiOutlineExclamationCircle
          className="text-red-600 mx-auto mb-2"
          size={40}
        />
        <h3 className="text-lg font-semibold mb-4">
          Bạn có chắc chắn muốn xóa phim này?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Xóa
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
