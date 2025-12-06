import TicketItem from "./TicketItem";

export default function TicketList({ tickets, onViewDetails }) {
  if (!tickets.length)
    return (
      <p className="text-gray-400 mt-4 text-center">Bạn chưa có vé nào.</p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
