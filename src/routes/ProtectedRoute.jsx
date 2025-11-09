import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../utils/auth";

export default function ProtectedRoute({ roles }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (!roles.includes(decoded.role)) return <Navigate to="/" replace />;
    return <Outlet />;
  } catch {
    return <Navigate to="/" replace />;
  }
}
