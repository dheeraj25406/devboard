export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="mb-4">
      {label && <label className="devboard-label">{label}</label>}
      <input
        className={`devboard-input ${error ? '!border-red-500/70' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
