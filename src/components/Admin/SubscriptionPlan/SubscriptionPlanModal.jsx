import { useState, useEffect } from "react";

export default function SubscriptionPlanModal({
  isOpen,
  onClose,
  planData,
  mode,
  onSubmit,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration_days: "",
    description: "",
  });

  useEffect(() => {
    if (planData) {
      setForm({
        name: planData.name || "",
        price: planData.price || "",
        duration_days: planData.duration_days || "",
        description: planData.description || "",
      });
    } else {
      setForm({
        name: "",
        price: "",
        duration_days: "",
        description: "",
      });
    }
  }, [planData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      price: Number(form.price),
      duration_days: Number(form.duration_days),
      description: form.description,
    });
  };

  if (!isOpen) return null;

  const isView = mode === "view";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "add" && "Thêm Gói"}
          {mode === "edit" && "Sửa Gói"}
          {mode === "view" && "Xem Gói"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Tên gói</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isView}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              disabled={isView}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Số ngày</label>
            <input
              type="number"
              name="duration_days"
              value={form.duration_days}
              onChange={handleChange}
              disabled={isView}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isView}
              className="w-full border px-3 py-2 rounded"
              rows={3}
              required
            />
          </div>

          {!isView && (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-2"
            >
              {mode === "add" ? "Thêm" : "Cập nhật"}
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full text-gray-600 hover:text-gray-800"
          >
            Đóng
          </button>
        </form>
      </div>
    </div>
  );
}
