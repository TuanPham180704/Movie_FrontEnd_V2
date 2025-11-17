import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import SearchBox from "./SearchBox";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreRes, countryRes] = await Promise.all([
          axios.get("http://localhost:8080/api/movies/genres"),
          axios.get("http://localhost:8080/api/movies/countries"),
        ]);
        setGenres(genreRes.data || []);
        setCountries(countryRes.data || []);
      } catch (err) {
        console.error("Lỗi khi tải thể loại / quốc gia:", err);
      }
    };
    fetchData();
  }, []);

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpenUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#1b1b1b] text-white shadow-md z-50 relative">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="leading-tight">
              <h1 className="text-xl font-semibold">🎬 DevChill</h1>
              <p className="text-xs text-gray-400">Phim hay cá rố</p>
            </div>
          </Link>
          <SearchBox />
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm grow justify-center relative">
          <Link to="/movies/list/phim-le" className="hover:text-yellow-400">
            Phim Lẻ
          </Link>
          <Link to="/movies/list/phim-bo" className="hover:text-yellow-400">
            Phim Bộ
          </Link>
          <Link to="/movies/list/hoat-hinh" className="hover:text-yellow-400">
            Hoạt Hình
          </Link>

          <DropdownHover
            title="Thể loại"
            items={genres}
            basePath="/movies/genres"
          />
          <DropdownHover
            title="Quốc gia"
            items={countries}
            basePath="/movies/countries"
          />
          <DropdownHover
            title="Năm"
            items={years.map((y) => ({ name: y, slug: y }))}
            basePath="/movies/years"
          />

          <Link
            to="/booking"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-full transition"
          >
            Đặt vé xem phim
          </Link>
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {token ? (
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUserMenu((prev) => !prev);
                }}
                className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-600 transition"
              >
                <FaUser className="mr-2" />
                Thông tin cá nhân
              </button>

              {openUserMenu && (
                <div
                  id="user-menu-dropdown"
                  className="absolute right-0 mt-2 w-44 bg-[#222] border border-gray-700 rounded-md shadow-lg py-2 z-50 animate-fadeIn"
                >
                  <Link
                    to="/premium"
                    className="block px-4 py-2 text-sm bg-amber-400 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenUserMenu(false);
                    }}
                  >
                    Nâng Cấp Premium
                  </Link>
                  <Link
                    to="/profile"
                    id="menu-profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenUserMenu(false);
                    }}
                  >
                    Tài Khoản
                  </Link>
                  <Link
                    to="/tickets"
                    className="block px-4 py-2 text-sm hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenUserMenu(false);
                    }}
                  >
                    Vé Đã Đặt
                  </Link>
                  <button
                    id="menu-logout"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white transition"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm hover:bg-gray-600 transition"
            >
              <FaUser className="mr-2" />
              Thành viên
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function DropdownHover({ title, items, basePath }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`cursor-pointer transition-colors duration-200 ${
          open ? "text-yellow-400" : "hover:text-yellow-400"
        }`}
      >
        {title}
      </button>

      <div
        className={`absolute bg-gray-800 rounded shadow-lg mt-2 p-3 w-48 z-50 transform transition-all duration-200 ease-in-out ${
          open
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        {items && items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item.slug}
              to={`${basePath}/${item.slug}`}
              className="block py-1 px-2 text-sm hover:text-yellow-400 hover:bg-gray-700 rounded transition"
            >
              {item.name}
            </Link>
          ))
        ) : (
          <span className="text-gray-400 text-sm">Đang tải...</span>
        )}
      </div>
    </div>
  );
}
