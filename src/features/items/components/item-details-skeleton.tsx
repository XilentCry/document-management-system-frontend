import { Skeleton } from "@/components/ui/skeleton";

export function ItemDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-36 h-4" />
      <div className="flex flex-col gap-1">
        <Skeleton className="w-21 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-21 h-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-25 h-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-21 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-20 h-4" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="w-21 h-4" />
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  );
}
