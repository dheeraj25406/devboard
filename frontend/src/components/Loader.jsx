export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      <p className="mt-4 text-sm devboard-muted">{message}</p>
    </div>
  );
}
