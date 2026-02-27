import { Skeleton } from "@/components/ui/skeleton";

export function MessagesSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-y-4 p-4 overflow-y-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-x-3">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
