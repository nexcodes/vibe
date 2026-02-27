import { ErrorFallback } from "@/components/error-fallback";
import { ProjectPageSkeleton } from "@/components/project-page-skeleton";
import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

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
    <ErrorBoundary
      fallback={
        <ErrorFallback
          variant="page"
          message="There was an error loading this project. Try refreshing the page."
        />
      }
    >
      <Suspense fallback={<ProjectPageSkeleton />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProjectView projectId={projectId} />
        </HydrationBoundary>
      </Suspense>
    </ErrorBoundary>
  );
}
