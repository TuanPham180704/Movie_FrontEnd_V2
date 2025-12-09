import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import axios from "axios";
import SearchBox from "./SearchBox";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [genres, setGenres] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <>
      <header className="bg-[#1b1b1b] text-white shadow-md z-50 relative">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 shrink-0">
            <button
              className="lg:hidden text-3xl mr-2"
              onClick={() => setMobileOpen(true)}
            >
              <HiMenu />
            </button>

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
              onClick={(e) => {
                if (!token) {
                  e.preventDefault();
                  toast.warning("Vui lòng đăng nhập trước khi đặt vé!", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-full transition"
            >
              Đặt vé xem phim
            </Link>
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            {token ? (
              <div className="relative" ref={userMenuRef}>
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
                  <div className="absolute right-0 mt-2 w-44 bg-[#222] border border-gray-700 rounded-md shadow-lg py-2 z-50">
                    <Link
                      to="/premium"
                      className="block px-4 py-2 text-sm bg-amber-400 hover:bg-blue-700"
                    >
                      Nâng Cấp Premium
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Tài Khoản
                    </Link>
                    <Link
                      to="/my-tickets"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Vé Đã Đặt
                    </Link>
                    <Link
                      to="/my-premium"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Gói Đã Mua
                    </Link>

                    <button
                      onClick={handleLogout}
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
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#1b1b1b] text-white z-50 shadow-xl transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setMobileOpen(false)} className="text-xl">
            ✕
          </button>
        </div>

        <div className="flex flex-col">
          <MobileLink
            to="/movies/list/phim-le"
            title="Phim Lẻ"
            setMobileOpen={setMobileOpen}
          />
          <MobileLink
            to="/movies/list/phim-bo"
            title="Phim Bộ"
            setMobileOpen={setMobileOpen}
          />
          <MobileLink
            to="/movies/list/hoat-hinh"
            title="Hoạt Hình"
            setMobileOpen={setMobileOpen}
          />

          {/* Dropdown mobile */}
          <MobileDropdown
            title="Thể loại"
            items={genres}
            basePath="/movies/genres"
            setMobileOpen={setMobileOpen}
          />
          <MobileDropdown
            title="Quốc gia"
            items={countries}
            basePath="/movies/countries"
            setMobileOpen={setMobileOpen}
          />
          <MobileDropdown
            title="Năm"
            items={years.map((y) => ({ name: y, slug: y }))}
            basePath="/movies/years"
            setMobileOpen={setMobileOpen}
          />

          <MobileLink
            to="/booking"
            title="Đặt vé xem phim"
            isButton
            setMobileOpen={setMobileOpen}
          />
        </div>
      </div>
    </>
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
          open ? "opacity-100 visible" : "opacity-0 invisible -translate-y-2"
        }`}
      >
        {items.length > 0 ? (
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

function MobileLink({ to, title, setMobileOpen, isButton }) {
  return (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`block px-5 py-4 text-base border-b border-gray-700 ${
        isButton
          ? "bg-yellow-500 text-black font-semibold text-center"
          : "hover:bg-gray-700"
      }`}
    >
      {title}
    </Link>
  );
}

function MobileDropdown({ title, items, basePath, setMobileOpen }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full px-5 py-4 text-left font-medium hover:bg-gray-700 flex justify-between"
        onClick={() => setOpen((p) => !p)}
      >
        {title} <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="pl-5 bg-[#222]">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`${basePath}/${item.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block px-5 py-3 text-sm border-b border-gray-800 hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
