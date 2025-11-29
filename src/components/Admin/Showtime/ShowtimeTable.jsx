import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";

export default function ShowtimeTable({ showtimes, onView, onEdit, onDelete }) {
  return (
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3">Phim</th>
          <th className="px-4 py-3">Rạp</th>
          <th className="px-4 py-3">Phòng</th>
          <th className="px-4 py-3">Ngày</th>
          <th className="px-4 py-3">Giờ</th>
          <th className="px-4 py-3 text-center">Giá vé</th>
          <th className="px-4 py-3 text-center w-32">Hành động</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {showtimes.length > 0 ? (
          showtimes.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {s.movie_title}
              </td>

              <td className="px-4 py-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {s.cinema_name}
                </span>
              </td>

              <td className="px-4 py-3">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {s.room_name}
                </span>
              </td>

              <td className="px-4 py-3">
                {new Date(s.show_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">{s.show_time}</td>

              <td className="px-4 py-3 text-center font-semibold">
                {s.ticket_price} ₫
              </td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(s)}
                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    title="Xem chi tiết"
                  >
                    <AiOutlineEye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(s)}
                    className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition"
                    title="Sửa"
                  >
                    <AiOutlineEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(s)}
                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                    title="Xóa"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-500">
              Không có dữ liệu
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
