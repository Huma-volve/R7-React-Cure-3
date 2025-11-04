export default function PageSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-background animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <div className="h-[150px] bg-gray-200 rounded-md"></div>
                <div className="h-5 w-4/5 bg-gray-200 rounded mt-2"></div>
            </div>
            <div>
                <div className="h-[150px] bg-gray-200 rounded-md"></div>
                <div className="h-5 w-4/5 bg-gray-200 rounded mt-2"></div>
            </div>
        </div>

        <div className="h-[200px] bg-gray-200 rounded-xl"></div>
    </div>
  );
}
