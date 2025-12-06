import { useEffect, useState } from "react";
import { subscriptionUserApi } from "../../../api/subscriptionUserApi";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { FaGift, FaDollarSign, FaInfoCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumLandingPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionUserApi.getPlans();
        setPlans(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải danh sách gói");
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (planId) => {
    try {
      const data = await subscriptionUserApi.getPlanById(planId);
      setSelectedPlan(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải chi tiết gói");
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    try {
      await subscriptionUserApi.buyPlan(selectedPlan.id);
      toast.success("Thanh toán thành công!");
      setSelectedPlan(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#6caae8] text-white flex justify-center py-12">
      <div className="flex flex-col gap-10 w-11/12 max-w-6xl">
        <section className="bg-gradient-r from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Trở thành DevChill Premium
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm DevChill Premium với:
            <br />• Xem phim không quảng cáo
            <br />• Truy cập sớm các bộ phim mới
            <br />• Tích điểm thưởng và ưu đãi đặc biệt
            <br />• Quản lý vé và lịch sử đặt dễ dàng
          </p>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className="bg-[#1A1A1A] p-6 rounded-2xl shadow-xl cursor-pointer flex flex-col justify-between"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 25px rgba(0,0,0,0.5)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => handleSelectPlan(plan.id)}
            >
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
                  <FaGift /> {plan.name}
                </h2>
                <p className="text-yellow-400 font-semibold mb-2 flex items-center gap-1 text-lg">
                  <FaDollarSign /> {plan.price} VND
                </p>
                <p className="text-gray-300 text-sm flex items-start gap-1">
                  <FaInfoCircle className="mt-1" /> {plan.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {showModal && selectedPlan && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>

              <motion.div
                className="relative bg-[#1E1E1E]/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full z-10 flex flex-col items-center gap-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes size={18} />
                </button>

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-400">
                  <FaGift /> {selectedPlan.name}
                </h2>
                <p className="text-gray-300 text-center">
                  {selectedPlan.description}
                </p>
                <p className="text-yellow-400 font-semibold text-lg">
                  <FaDollarSign className="inline-block mr-1" />
                  {selectedPlan.price} VND
                </p>

                <QRCode
                  value={JSON.stringify({
                    planId: selectedPlan.id,
                    name: selectedPlan.name,
                    price: selectedPlan.price,
                  })}
                  size={140}
                  className="bg-white p-2 rounded-lg"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-semibold px-6 py-3 rounded-xl w-full text-center"
                  onClick={handlePayment}
                >
                  Thanh Toán
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
