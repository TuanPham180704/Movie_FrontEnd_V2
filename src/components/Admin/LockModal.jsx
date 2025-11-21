export default function LockModal({ user, onClose, onSubmit }) {
  const handleLock = () => {
    onSubmit(user.id, !user.is_active);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-3">
          {user.is_active ? "Khóa tài khoản khách hàng?" : "Mở khóa tài khoản?"}
        </h2>

        <p className="text-gray-600">
          Tài khoản: <b>{user.username}</b>
        </p>
        <p>Email: {user.email}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Hủy
          </button>
          <button
            onClick={handleLock}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {user.is_active ? "Khóa" : "Mở khóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
