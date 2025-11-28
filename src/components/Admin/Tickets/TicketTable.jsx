import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export default function TicketTable({ tickets, onView, onEdit, onDelete }) {
  return (
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 w-16 text-center">ID</th>
          <th className="px-4 py-3">Khách</th>
          <th className="px-4 py-3">Phim</th>
          <th className="px-4 py-3">Phòng</th>
          <th className="px-4 py-3">Ghế</th>
          <th className="px-4 py-3 text-center">Trạng thái</th>
          <th className="px-4 py-3 text-center w-32">Thao tác</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {tickets.length > 0 ? (
          tickets.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-center font-medium">{t.id}</td>

              <td className="px-4 py-3 font-medium text-gray-900">
                {t.user_name}
              </td>

              <td className="px-4 py-3">{t.movie_title}</td>

              <td className="px-4 py-3">
                <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {t.room_name}
                </span>
              </td>

              <td className="px-4 py-3 font-semibold">{t.seat_number}</td>

              <td className="px-4 py-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    t.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {t.status === "paid" ? "Đã thanh toán" : t.status}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(t)}
                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    title="Xem chi tiết"
                  >
                    <AiOutlineEye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(t)}
                    className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition"
                    title="Sửa"
                  >
                    <AiOutlineEdit size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(t)}
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
            <td colSpan="7" className="text-center py-8 text-gray-500">
              Không có vé nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
