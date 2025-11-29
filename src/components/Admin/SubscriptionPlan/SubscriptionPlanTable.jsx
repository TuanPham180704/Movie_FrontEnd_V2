import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export default function SubscriptionPlanTable({
  plans,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 w-16 text-center">ID</th>
          <th className="px-4 py-3">Tên gói</th>
          <th className="px-4 py-3 text-right">Giá (VNĐ)</th>
          <th className="px-4 py-3 text-center">Số ngày</th>
          <th className="px-4 py-3">Mô tả</th>
          <th className="px-4 py-3 text-center w-32">Thao tác</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {plans.length > 0 ? (
          plans.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-center font-medium">{p.id}</td>

              <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>

              <td className="px-4 py-3 text-right font-semibold">
                {Number(p.price).toLocaleString()}
              </td>

              <td className="px-4 py-3 text-center font-semibold">
                {p.duration_days}
              </td>

              <td className="px-4 py-3">{p.description}</td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onView(p)}
                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                    title="Xem chi tiết"
                  >
                    <AiOutlineEye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(p)}
                    className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition"
                    title="Sửa"
                  >
                    <AiOutlineEdit size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(p)}
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
            <td colSpan="6" className="text-center py-8 text-gray-500">
              Không có gói nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
