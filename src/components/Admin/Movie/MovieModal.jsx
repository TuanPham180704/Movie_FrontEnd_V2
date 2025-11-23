import  { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";

export default function MovieModal({
  isOpen,
  onClose,
  onSubmit,
  movie,
  readOnly = false,
}) {
  const initialState = {
    title: "",
    category: "",
    description: "",
    poster_url: "",
    rating: 0,
    duration: 0,
    is_offline: false,
    release_date: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [posterFile, setPosterFile] = useState(null); // file upload

  useEffect(() => {
    if (isOpen) {
      if (movie) {
        setFormData(movie);
        setPosterFile(null); // reset file
      } else {
        setFormData(initialState);
        setPosterFile(null);
      }
    }
  }, [isOpen, movie]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setFormData({
        ...formData,
        poster_url: URL.createObjectURL(file), // preview
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // nếu có file, gửi file kèm formData
    onSubmit({ ...formData, posterFile });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {readOnly
              ? "Chi tiết phim"
              : movie
              ? "Chỉnh sửa phim"
              : "Thêm phim mới"}
          </h2>
          <button
            className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-200"
            onClick={onClose}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="movieForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Cột ảnh */}
              <div className="md:col-span-4 space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-sm text-gray-700">
                    Poster URL hoặc chọn file
                  </label>
                  <input
                    type="text"
                    name="poster_url"
                    value={formData.poster_url}
                    onChange={handleChange}
                    className="border border-gray-300 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                    readOnly={readOnly}
                  />
                  {!readOnly && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border border-gray-300 px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Preview ảnh */}
                <div className="w-full aspect-2/3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                  {formData.poster_url ? (
                    <img
                      src={formData.poster_url}
                      alt="Poster Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <AiOutlineCloudUpload size={40} />
                      <span className="text-sm mt-2">Chưa có ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cột thông tin phim */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="font-semibold mb-1 text-sm text-gray-700">
                      Tên phim <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={readOnly}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-sm text-gray-700">
                      Thể loại
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={readOnly}
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-1 text-sm text-gray-700">
                      Ngày ra mắt
                    </label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date?.slice(0, 10)}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={readOnly}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-semibold mb-1 text-sm text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                    rows={4}
                    readOnly={readOnly}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-700">
                      Thời lượng (phút)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={readOnly}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-700">
                      Đánh giá (0-10)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="10"
                      className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      readOnly={readOnly}
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center space-x-2 cursor-pointer bg-gray-100 p-2 rounded-lg border hover:bg-gray-200 transition">
                      <input
                        type="checkbox"
                        name="is_offline"
                        checked={formData.is_offline}
                        onChange={handleChange}
                        disabled={readOnly}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="font-semibold text-gray-700 select-none">
                        Đang chiếu (Offline)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="p-5 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition"
          >
            {readOnly ? "Đóng" : "Hủy bỏ"}
          </button>
          {!readOnly && (
            <button
              type="submit"
              form="movieForm"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md transition transform active:scale-95"
            >
              {movie ? "Lưu thay đổi" : "Thêm phim mới"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
