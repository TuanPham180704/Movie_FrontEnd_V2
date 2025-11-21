import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[350px]">
        <h2 className="text-lg font-semibold mb-3 text-red-600">
          Xác nhận xóa
        </h2>
        <p className="mb-5">
          Bạn có chắc chắn muốn xóa <b>{itemName}</b> không?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
