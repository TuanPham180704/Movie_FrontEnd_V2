import { useState, useEffect } from "react";
import {
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
} from "../../api/userApi";
import { AiOutlineEye, AiOutlineLock, AiOutlineDelete } from "react-icons/ai";
import CustomerModal from "../../components/Admin/Users/CustomerModal";
import LockModal from "../../components/Admin/Users/LockModal";
import DeleteModal from "../../components/Admin/Users/DeleteModal";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import { toast } from "react-toastify";

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [lockUserData, setLockUserData] = useState(null);
  const [deleteUserData, setDeleteUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const limit = 5;

  const loadData = async () => {
    try {
      const result = await getUsers({ page, limit, search });
      setUsers(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Lỗi load users:", error);
      toast.error("Lỗi tải danh sách khách hàng");
    }
  };

  useEffect(() => {
    loadData();
  }, [page, search]);

  const handleOpenDetail = async (id) => {
    const data = await getUserById(id);
    setSelectedUser(data);
    setIsEdit(false);
  };

  const handleOpenEdit = async (id) => {
    const data = await getUserById(id);
    setSelectedUser(data);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      toast.success("Xóa thành công");
      loadData();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const handleLock = async (id, isActive) => {
    try {
      await updateUser(id, { is_active: isActive });
      toast.success(isActive ? "Mở khóa thành công" : "Khóa thành công");
      setLockUserData(null);
      loadData();
    } catch (error) {
      toast.error("Có lỗi khi cập nhật trạng thái");
    }
  };

  const csvData = users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    gender: u.gender,
    status: u.is_active ? "Hoạt động" : "Bị khóa",
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Quản lý Khách Hàng</h1>
      <p className="text-gray-500 mb-4">
        Quản lý thông tin và hoạt động của khách hàng trong hệ thống
      </p>

      <div className="flex items-center justify-between mb-4">
        <input
          className="border rounded px-3 py-2 w-96"
          placeholder="Tìm kiếm theo tên hoặc email…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <ExportCSV
          data={csvData}
          fields={["id", "username", "email", "gender", "status"]}
          fileName="DanhSachKhachHang"
        />
      </div>

      <div className="bg-white rounded shadow h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Giới tính</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {u.username?.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{u.username}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.gender}</td>
                  <td className="px-4 py-3">
                    {u.is_active ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        ✔ Hoạt động
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        ✘ Bị khóa
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 border rounded"
                      onClick={() => handleOpenDetail(u.id)}
                    >
                      <AiOutlineEye size={18} className="text-blue-600" />
                    </button>
                    <button
                      className="p-2 border rounded"
                      onClick={() =>
                        setLockUserData({
                          id: u.id,
                          username: u.username,
                          email: u.email,
                          is_active: u.is_active,
                        })
                      }
                    >
                      <AiOutlineLock
                        size={18}
                        className={
                          u.is_active ? "text-red-500" : "text-green-500"
                        }
                      />
                    </button>
                    <button
                      className="p-2 border rounded"
                      onClick={() =>
                        setDeleteUserData({
                          id: u.id,
                          username: u.username,
                        })
                      }
                    >
                      <AiOutlineDelete size={18} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t py-3 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {selectedUser && (
        <CustomerModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onReload={loadData}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      )}

      {lockUserData && (
        <LockModal
          user={lockUserData}
          onClose={() => setLockUserData(null)}
          onSubmit={handleLock}
        />
      )}

      {deleteUserData && (
        <DeleteModal
          isOpen={true}
          itemName={deleteUserData.username}
          onClose={() => setDeleteUserData(null)}
          onConfirm={async () => {
            await handleDelete(deleteUserData.id);
            setDeleteUserData(null);
          }}
        />
      )}
    </div>
  );
}
