const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  secondary:
    'bg-[rgba(39,39,43,0.45)] hover:bg-[rgba(45,45,50,0.55)] text-[#f4f4f5] border border-[rgba(255,255,255,0.035)]',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost:
    'bg-transparent hover:bg-[rgba(255,255,255,0.04)] text-[#a1a1aa] hover:text-[#f4f4f5]',
};

export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
