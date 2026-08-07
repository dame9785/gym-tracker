export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-4">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}
