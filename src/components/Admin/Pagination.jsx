import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
  maxVisible = 5,
}) {
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      onPageChange(p);
    }
  };

  const half = Math.floor(maxVisible / 2);
  let start = page - half;
  let end = page + half;

  if (start < 1) {
    start = 1;
    end = Math.min(maxVisible, totalPages);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // luôn render container, kể cả khi totalPages = 1
  return (
    <div className={`flex items-center gap-2 justify-center ${className}`}>
      <button
        onClick={() => goToPage(1)}
        disabled={page === 1}
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <FaAngleLeft />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`px-3 py-1 border rounded 
            ${p === page ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-100"}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <FaAngleRight />
      </button>
      <button
        onClick={() => goToPage(totalPages)}
        disabled={page === totalPages}
        className="p-2 border rounded hover:bg-gray-100 disabled:opacity-40"
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
}

