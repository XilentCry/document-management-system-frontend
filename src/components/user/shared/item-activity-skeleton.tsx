import { Skeleton } from "@/components/ui/skeleton";

export function ItemActivitySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-72 h-4" />
        <Skeleton className="w-25 h-4" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-64 h-4" />
        <Skeleton className="w-30 h-4" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-72 h-4" />
        <Skeleton className="w-25 h-4" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-72 h-4" />
        <Skeleton className="w-40 h-4" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-60 h-4" />
        <Skeleton className="w-35 h-4" />
      </div>
    </div>
  );
}
