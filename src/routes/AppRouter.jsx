import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MovieList from "../components/MovieList";
import CategoryPage from "../components/CategoryPage";
import ProtectedRoute from "./ProtectedRoute";
import MovieDetail from "../pages/MovieDetail";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../components/Client/ForgotPassword";
import ResetPassword from "../components/Client/ResetPassword";

import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";

export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/movies/phim-bo" element={<MovieList />} />
            <Route path="/movies/phim-le" element={<MovieList />} />
            <Route path="/movies/hoat-hinh" element={<MovieList />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/search" element={<MovieList />} />
            <Route path="/movies/genres/:slug" element={<MovieList />} />
            <Route path="/movies/countries/:slug" element={<MovieList />} />
            <Route path="/movies/:slug" element={<MovieDetail />} />
            <Route path="/movies/years/:slug" element={<MovieList />} />
            <Route path="/movies/:type/:slug" element={<MovieList />} />
            <Route path="/category/:type" element={<CategoryPage />} />
          </Route>
          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
            </Route>
          </Route>
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
