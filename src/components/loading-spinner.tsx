import { FaDumbbell } from 'react-icons/fa6';

export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Laddar">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-800 border-t-orange-500" />

        <FaDumbbell className="h-6 w-6 text-orange-500" />
      </div>
    </div>
  );
}
