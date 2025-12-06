// Pagination.jsx
export default function Pagination({ currentPage, totalPages, onChangePage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-6 sticky bottom-0 bg-[#1A1A1A] p-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChangePage(page)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            page === currentPage
              ? "bg-yellow-400 text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
