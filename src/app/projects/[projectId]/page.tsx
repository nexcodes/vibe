import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectIdPage({ params }: Props) {
  const { projectId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.messages.getMany.queryOptions({ projectId }),
  );
  void queryClient.prefetchQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectView projectId={projectId} />
      </HydrationBoundary>
    </Suspense>
  );
}
