import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    const params = new URLSearchParams(location.search);
    params.set("keyword", q);
    params.set("page", "1");
    navigate(
      `/movies/search?keyword=${encodeURIComponent(search.trim())}&page=1`
    );
    setSearch(" ");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-[#2a2a2a] rounded-lg px-3 py-1.5 w-[320px]"
    >
      <FaSearch className="text-gray-400 mr-2 text-sm" />
      <input
        type="text"
        id="search"
        placeholder="Tìm kiếm phim..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent outline-none text-sm w-full placeholder-gray-400 text-white"
      />
    </form>
  );
}
