import { useEffect, useState } from "react";

export default function CinemaModal({
  isOpen,
  mode = "view",
  initialData,
  onClose,
  onSubmit,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        city: initialData.city || "",
        phone: initialData.phone || "",
      });
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        phone: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isView) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isView) return;
    onSubmit(formData);
  };

  const title = isCreate
    ? "Thêm rạp mới"
    : isEdit
    ? "Chỉnh sửa rạp"
    : "Thông tin rạp";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        {/* Header */}
        <div className="px-3 sm:px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-base"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-3 sm:px-5 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên rạp <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={isView}
                placeholder="Ví dụ: DevChill Huế"
                required
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring ${
                  isView
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-blue-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                disabled={isView}
                placeholder="56 Hùng Vương, TP. Huế"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring ${
                  isView
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-blue-200"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thành phố
                </label>
                <input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isView}
                  placeholder="Thừa Thiên Huế"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring ${
                    isView
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:ring-blue-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isView}
                  placeholder="0234 888 666"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring ${
                    isView
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:ring-blue-200"
                  }`}
                />
              </div>
            </div>

            {initialData?.created_at && (
              <div className="text-xs text-gray-500 border-t pt-2 mt-2">
                Ngày tạo:{" "}
                {new Date(initialData.created_at).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <div className="px-3 sm:px-5 py-3 border-t flex flex-col sm:flex-row justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 w-full sm:w-auto"
            >
              Đóng
            </button>
            {!isView && (
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
              >
                {isCreate ? "Thêm rạp" : "Lưu thay đổi"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
