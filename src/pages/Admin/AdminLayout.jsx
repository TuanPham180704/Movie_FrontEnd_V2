import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
