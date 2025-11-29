import { useNavigate } from "react-router-dom";

export function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi!</h2>
        <pre className="bg-gray-100 p-3 rounded text-left text-sm text-gray-800 max-h-40 overflow-auto">
          {error?.message || "Lỗi không xác định"}
        </pre>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
