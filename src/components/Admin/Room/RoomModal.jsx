import { useEffect, useState } from "react";

export default function RoomModal({
  isOpen,
  onClose,
  mode,
  initialData,
  onSubmit,
  cinemas,
}) {
  const [formData, setFormData] = useState({
    cinema_id: "",
    name: "",
    seat_layout: { rows: 10, cols: 10 },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cinema_id: initialData.cinema_id || "",
        name: initialData.name || "",
        seat_layout: initialData.seat_layout || { rows: 10, cols: 10 },
      });
    } else {
      setFormData({
        cinema_id: "",
        name: "",
        seat_layout: { rows: 10, cols: 10 },
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rows" || name === "cols") {
      setFormData({
        ...formData,
        seat_layout: { ...formData.seat_layout, [name]: Number(value) },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cinema_id || !formData.name)
      return alert("Vui lòng điền đầy đủ thông tin");
    onSubmit(formData);
  };

  const isView = mode === "view";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-3">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "create"
              ? "Thêm phòng"
              : mode === "edit"
              ? "Sửa phòng"
              : "Xem phòng"}
          </h2>
        </div>
        <form className="px-5 py-4 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Rạp:</label>
            <select
              name="cinema_id"
              value={formData.cinema_id}
              onChange={handleChange}
              disabled={isView}
              className="border p-2 rounded w-full"
            >
              <option value="">Chọn rạp</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Tên phòng:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isView}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-sm mb-1">Số hàng:</label>
              <input
                type="number"
                name="rows"
                value={formData.seat_layout.rows}
                onChange={handleChange}
                disabled={isView}
                className="border p-2 rounded w-20"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Số cột:</label>
              <input
                type="number"
                name="cols"
                value={formData.seat_layout.cols}
                onChange={handleChange}
                disabled={isView}
                className="border p-2 rounded w-20"
              />
            </div>
          </div>
          {!isView && (
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          )}
          {isView && (
            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
