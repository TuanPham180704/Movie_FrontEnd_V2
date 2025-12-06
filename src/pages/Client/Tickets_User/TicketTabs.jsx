const tabs = [
  { id: "all", label: "Tất Cả Vé" },
  { id: "paid", label: "Vé Đã Thanh Toán" },
  { id: "pending", label: "Vé Chờ Thanh Toán" },
  { id: "cancelled", label: "Đã Hủy" },
];

export default function TicketTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-4 mb-6 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`pb-2 font-medium transition ${
            activeTab === tab.id
              ? "border-b-2 border-yellow-400 text-yellow-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
