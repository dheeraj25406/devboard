export default function StatCard({ label, value }) {
  return (
    <div className="devboard-stat">
      <p className="text-sm devboard-muted">{label}</p>
      <p className="devboard-heading mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
