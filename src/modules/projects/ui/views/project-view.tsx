"use client";

import FileExplorer from "@/components/file-explorer";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fragment } from "@/generated/prisma";
import { ErrorFallback } from "@/components/error-fallback";
import { MessagesSkeleton } from "@/components/messages-skeleton";
import { ProjectHeaderSkeleton } from "@/components/project-header-skeleton";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import FragmentWeb from "../components/fragment-web";
import MessagesContainer from "../components/messages-container";
import ProjectHeader from "../components/project-header";
import { UserControl } from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasPremiumAccess = has?.({ plan: "pro" });
  const trpc = useTRPC();

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  const { mutate: resumeSandbox } = useMutation(
    trpc.projects.resumeSandbox.mutationOptions(),
  );

  const handleSetActiveFragment = (fragment: Fragment | null) => {
    setActiveFragment(fragment);
    if (fragment) {
      resumeSandbox({ fragmentId: fragment.id });
    }
  };

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary
            fallback={
              <ErrorFallback variant="inline" title="Failed to load project" />
            }
          >
            <Suspense fallback={<ProjectHeaderSkeleton />}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <ErrorFallback
                variant="panel"
                title="Failed to load messages"
                message="There was an error loading the conversation. Try refreshing the page."
              />
            }
          >
            <Suspense fallback={<MessagesSkeleton />}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={handleSetActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          {!!activeFragment ? (
            <Tabs
              className="h-full gap-y-0"
              defaultValue="preview"
              value={tabState}
              onValueChange={(value) =>
                setTabState(value as "preview" | "code")
              }
            >
              <div className="w-full flex items-center p-2 border-b gap-x-2">
                <TabsList className="h-8 p-0 border rounded-md">
                  <TabsTrigger value="preview" className="rounded-md">
                    <EyeIcon /> <span>Demo</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="rounded-md">
                    <CodeIcon /> <span>Code</span>
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-x-2">
                  {!hasPremiumAccess && (
                    <Button asChild size="sm" variant="tertiary">
                      <Link href="/pricing">
                        <CrownIcon /> Upgrade
                      </Link>
                    </Button>
                  )}
                  <UserControl />
                </div>
              </div>
              <TabsContent value="preview">
                <FragmentWeb data={activeFragment} />
              </TabsContent>
              <TabsContent value="code" className="min-h-0">
                {!!activeFragment?.files && (
                  <FileExplorer
                    files={activeFragment.files as { [path: string]: string }}
                  />
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted">
                <CodeIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="font-semibold text-lg">No fragment selected</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Send a message to generate code, then select a fragment from
                  the conversation to preview it here.
                </p>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
