export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex justify-center space-x-2">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`px-3 py-1 border rounded transition ${
            p === currentPage ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
