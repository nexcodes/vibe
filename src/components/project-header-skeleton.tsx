import { Skeleton } from "@/components/ui/skeleton";

export function ProjectHeaderSkeleton() {
  return (
    <div className="flex items-center gap-x-2 p-2 border-b">
      <Skeleton className="size-[18px] rounded-sm shrink-0" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}
