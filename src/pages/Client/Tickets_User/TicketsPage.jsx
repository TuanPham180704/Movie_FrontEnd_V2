import { useEffect, useState } from "react";
import Sidebar from "../SideBar";
import TicketTabs from "./TicketTabs";
import TicketList from "./TicketList";
import TicketModal from "./TicketModal";
import Pagination from "../Pagination";
import { userTicketApi } from "../../../api/userTicketApi";
import { toast } from "react-toastify";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [ticketGroups, setTicketGroups] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 6;

  const groupTickets = (ticketData) => {
    const groupsMap = {};

    ticketData.forEach((ticket) => {
      const groupId = ticket.group_id ?? `single-${ticket.id}`; 
      if (!groupsMap[groupId]) {
        groupsMap[groupId] = {
          group_id: ticket.group_id,
          tickets: [],
          movie_title: ticket.movie_title,
          poster_url: ticket.poster_url,
          room_name: ticket.room_name,
          booking_date: ticket.booking_date,
          status: ticket.status,
          totalPrice: 0,
        };
      }
      groupsMap[groupId].tickets.push(ticket);
      groupsMap[groupId].totalPrice += parseFloat(ticket.price);
      if (ticket.status === "pending") groupsMap[groupId].status = "pending";
    });

    return Object.values(groupsMap);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const ticketData = await userTicketApi.getAll();
        setTickets(ticketData);
        setTicketGroups(groupTickets(ticketData));
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải vé!");
      } finally {
        setLoadingTickets(false);
      }
    };
    fetchTickets();
  }, []);

  const refreshTickets = async () => {
    setLoadingTickets(true);
    try {
      const ticketData = await userTicketApi.getAll();
      setTickets(ticketData);
      setTicketGroups(groupTickets(ticketData));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const filteredGroups = ticketGroups.filter((group) =>
    activeTab === "all"
      ? true
      : group.tickets.some((t) => t.status === activeTab)
  );

  const totalPages = Math.ceil(filteredGroups.length / ticketsPerPage);
  const displayedGroups = filteredGroups.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  const handleViewDetails = (group) => {
    setSelectedTicket(group);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex justify-center py-10">
      <div className="flex gap-8 w-10/12">
        <Sidebar active="tickets" />

        <main className="flex-1 bg-[#1A1A1A] rounded-2xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Vé đã đặt</h2>
          <p className="text-gray-400 mb-6">
            Quản lý tất cả vé của bạn theo trạng thái
          </p>

          <TicketTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {loadingTickets ? (
            <div className="text-gray-400 text-center py-10">
              Đang tải vé...
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-gray-400 text-center py-10">
              Chưa có vé nào.
            </div>
          ) : (
            <>
              <TicketList
                tickets={displayedGroups}
                onViewDetails={handleViewDetails}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChangePage={(page) => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {modalOpen && selectedTicket && (
        <TicketModal
          ticket={selectedTicket} 
          onClose={() => setModalOpen(false)}
          refresh={refreshTickets}
        />
      )}
    </div>
  );
}
