import { MessagesSkeleton } from "@/components/messages-skeleton";
import { ProjectHeaderSkeleton } from "@/components/project-header-skeleton";

export function ProjectPageSkeleton() {
  return (
    <div className="h-screen flex">
      <div className="flex flex-col w-[35%] border-r">
        <ProjectHeaderSkeleton />
        <MessagesSkeleton />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="size-8 rounded-full border-4 border-muted border-t-primary animate-spin" />
      </div>
    </div>
  );
}
