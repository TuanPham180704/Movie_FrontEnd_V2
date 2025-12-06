import { useEffect, useState } from "react";
import Sidebar from "../SideBar";
import { subscriptionUserApi } from "../../../api/subscriptionUserApi";
import { toast } from "react-toastify";
import { FaGift, FaDollarSign, FaCalendarDay } from "react-icons/fa";
import { motion } from "framer-motion";
import Pagination from "../Pagination";

export default function MyPremiumPage() {
  const [userSubs, setUserSubs] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const subsPerPage = 6;

  useEffect(() => {
    fetchUserSubscriptions();
  }, []);

  const fetchUserSubscriptions = async () => {
    setLoadingSubs(true);
    try {
      const data = await subscriptionUserApi.getUserSubscriptions();
      setUserSubs(data);

      const now = new Date();
      let total = 0;
      data.forEach((sub) => {
        const endDate = new Date(sub.end_date);
        if (endDate > now) {
          total += Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        }
      });
      setTotalDays(total);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải gói đã mua");
    } finally {
      setLoadingSubs(false);
    }
  };

  const totalPages = Math.ceil(userSubs.length / subsPerPage);
  const displayedSubs = userSubs.slice(
    (currentPage - 1) * subsPerPage,
    currentPage * subsPerPage
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center py-10">
      <div className="flex gap-8 w-10/12">
        <Sidebar active="my-premium" />

        <main className="flex-1 bg-[#1A1A1A] rounded-2xl p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-4 text-center text-purple-400">
            Gói Premium Của Bạn
          </h1>

          <div className="text-center mb-6">
            <p className="text-gray-400">
              Tổng số ngày Premium còn lại:{" "}
              <span className="text-yellow-400 font-bold">
                {totalDays} ngày
              </span>
            </p>
          </div>

          {loadingSubs ? (
            <div className="text-gray-400 text-center py-10">
              Đang tải gói Premium...
            </div>
          ) : userSubs.length === 0 ? (
            <div className="text-gray-400 text-center py-10">
              Bạn chưa mua gói nào.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayedSubs.map((sub) => {
                  const startDate = new Date(
                    sub.start_date
                  ).toLocaleDateString();
                  const endDate = new Date(sub.end_date).toLocaleDateString();
                  const now = new Date();
                  const remainingDays =
                    new Date(sub.end_date) > now
                      ? Math.ceil(
                          (new Date(sub.end_date) - now) / (1000 * 60 * 60 * 24)
                        )
                      : 0;

                  return (
                    <motion.div
                      key={sub.id}
                      className="bg-[#1E1E1E] p-4 rounded-xl shadow-md flex flex-col items-center gap-1 min-h-[180px] cursor-pointer"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h2 className="text-md font-bold flex items-center gap-2 text-indigo-200">
                        <FaGift /> {sub.plan_name}
                      </h2>
                      <p className="text-yellow-300 font-semibold flex items-center gap-1 text-sm">
                        <FaDollarSign /> {sub.price} VND
                      </p>
                      <p className="text-gray-200 text-center text-xs line-clamp-3">
                        {sub.description}
                      </p>
                      <p className="text-gray-300 text-xs flex items-center gap-1 mt-1">
                        <FaCalendarDay /> {startDate} → {endDate}
                      </p>
                      <p
                        className={`font-bold mt-1 text-sm ${
                          remainingDays > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {remainingDays > 0
                          ? `Còn lại: ${remainingDays} ngày`
                          : "Đã hết hạn"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChangePage={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
