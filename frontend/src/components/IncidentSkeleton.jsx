export default function IncidentSkeleton() {
  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-700 rounded w-16"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-32"></div>
      </div>
    </>
  );
}
