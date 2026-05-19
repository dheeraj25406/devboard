export default function EmptyState({ title, description, action }) {
  return (
    <div className="devboard-empty">
      <h3 className="devboard-heading text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm devboard-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
