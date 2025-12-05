export default function CinemaSelect({
  cinemas,
  selectedCinema,
  onSelectCinema,
}) {
  return (
    <section className="max-w-6xl mx-auto mt-6 p-6 bg-white rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">Chọn rạp</h2>
      <select
        className="border p-2 rounded-lg w-64 text-pink-600"
        value={selectedCinema?.id || ""}
        onChange={(e) => {
          const c = cinemas.find((c) => c.id === Number(e.target.value));
          onSelectCinema(c);
        }}
      >
        <option value="">-- Chọn rạp --</option>
        {cinemas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </section>
  );
}
