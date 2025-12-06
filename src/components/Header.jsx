import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaCrown, FaUser, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import SearchBox from "./SearchBox";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
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
    toast.info("Đã đăng xuất!");
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
          <div className="hidden sm:block">
            <SearchBox />
          </div>
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
            onClick={(e) => {
              const token = localStorage.getItem("token");
              if (!token) {
                e.preventDefault();
                toast.warning("Vui lòng đăng nhập trước khi đặt vé!");
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-full transition"
          >
            Đặt vé xem phim
          </Link>
        </nav>
        <div className="flex items-center gap-4 shrink-0">
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setOpenMobileMenu(true)}
          >
            <FaBars />
          </button>
          {token && (
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
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
                <div className="absolute right-0 mt-2 w-48 bg-[#222] border border-gray-700 rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/premium"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-amber-400 hover:bg-amber-500 text-black font-semibold"
                  >
                    <FaCrown className="text-yellow-800 text-lg" />
                    Nâng Cấp Premium
                  </Link>

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Tài Khoản
                  </Link>
                  <Link
                    to="/tickets"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Vé Đã Đặt
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition"
                  >
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {openMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 lg:hidden">
          <div className="absolute right-0 top-0 w-72 h-full bg-[#222] p-5 shadow-xl animate-slideLeft">
            <button
              onClick={() => setOpenMobileMenu(false)}
              className="text-white text-2xl mb-4"
            >
              <FaTimes />
            </button>

            <SearchBox />

            <div className="mt-4 flex flex-col gap-2">
              <MobileLink to="/movies/list/phim-le">Phim Lẻ</MobileLink>
              <MobileLink to="/movies/list/phim-bo">Phim Bộ</MobileLink>
              <MobileLink to="/movies/list/hoat-hinh">Hoạt Hình</MobileLink>

              <DropdownMobile
                title="Thể Loại"
                items={genres}
                basePath="/movies/genres"
              />
              <DropdownMobile
                title="Quốc Gia"
                items={countries}
                basePath="/movies/countries"
              />
              <DropdownMobile
                title="Năm"
                items={years.map((y) => ({ name: y, slug: y }))}
                basePath="/movies/years"
              />

              <MobileLink to="/booking">Đặt vé xem phim</MobileLink>

              {token ? (
                <>
                  <MobileLink
                    to="/premium"
                    icon={<FaCrown className="text-yellow-400" />}
                  >
                    Nâng cấp Premium
                  </MobileLink>

                  <MobileLink to="/profile">Tài khoản</MobileLink>
                  <MobileLink to="/tickets">Vé đã đặt</MobileLink>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 mt-2 bg-red-600 rounded text-white"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <MobileLink to="/login">Đăng nhập</MobileLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
function MobileLink({ to, children, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
    >
      {icon}
      {children}
    </Link>
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
        className={`cursor-pointer ${
          open ? "text-yellow-400" : "hover:text-yellow-400"
        }`}
      >
        {title}
      </button>

      <div
        className={`absolute bg-gray-800 rounded shadow-lg mt-2 p-3 w-48 z-50 transition-all ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {items?.length ? (
          items.map((item) => (
            <Link
              key={item.slug}
              to={`${basePath}/${item.slug}`}
              className="block py-1 px-2 text-sm hover:text-yellow-400 hover:bg-gray-700 rounded"
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
function DropdownMobile({ title, items, basePath }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2 bg-gray-700 rounded text-white"
      >
        {title}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="ml-3 mt-1 flex flex-col gap-1">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`${basePath}/${item.slug}`}
              className="block px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
