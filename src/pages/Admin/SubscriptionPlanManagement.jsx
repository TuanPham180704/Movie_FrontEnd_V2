import { useEffect, useState } from "react";
import { subscriptionPlanApi } from "../../api/subscriptionPlanApi";
import Pagination from "../../components/Pagination";
import ExportCSV from "../../components/common/ExportCSV";
import SubscriptionPlanTable from "../../components/Admin/SubscriptionPlan/SubscriptionPlanTable";
import SubscriptionPlanModal from "../../components/Admin/SubscriptionPlan/SubscriptionPlanModal";
import ConfirmDeleteModal from "../../components/Admin/ConfirmDeleteModal";
import { toast } from "react-toastify";

export default function SubscriptionPlanManagement() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchPlans = async () => {
    try {
      const data = await subscriptionPlanApi.getAll();
      setPlans(data);
      setFilteredPlans(data);
    } catch (err) {
      toast.error("Lỗi tải gói subscription");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = plans.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.price?.toString().includes(term) ||
        p.duration_days?.toString().includes(term)
    );

    setFilteredPlans(filtered);
    setCurrentPage(1);
  }, [searchTerm, plans]);

  const handleView = (plan) => {
    setSelectedPlan(plan);
    setModalMode("view");
    setIsPlanModalOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setModalMode("edit");
    setIsPlanModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    setModalMode("add");
    setIsPlanModalOpen(true);
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitPlan = async (data) => {
    try {
      if (modalMode === "edit") {
        await subscriptionPlanApi.update(selectedPlan.id, data);
        toast.success("Cập nhật gói thành công!");
      } else if (modalMode === "add") {
        await subscriptionPlanApi.create(data);
        toast.success("Thêm gói thành công!");
      }
      setIsPlanModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error("Thao tác thất bại!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await subscriptionPlanApi.delete(selectedPlan.id);
      toast.success("Xóa gói thành công!");
      setIsDeleteModalOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const totalPages = Math.ceil(filteredPlans.length / pageSize);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Quản Lý Gói Premium</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Tìm theo tên, giá, mô tả, số ngày..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-72"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Thêm gói mới
          </button>
          <ExportCSV
            data={filteredPlans}
            fileName="subscription_plans"
            fields={[
              "id",
              "name",
              "price",
              "duration_days",
              "description",
              "created_at",
            ]}
          />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <SubscriptionPlanTable
            plans={paginatedPlans}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="border-t py-3 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <SubscriptionPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        planData={selectedPlan}
        mode={modalMode}
        onSubmit={handleSubmitPlan}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Xóa Gói"
        message={`Bạn muốn xóa gói "${selectedPlan?.name}"?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
