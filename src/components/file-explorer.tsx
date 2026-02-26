import { useState, useMemo, useCallback, Fragment } from "react";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Hint } from "@/components//hint";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getLanguageFromExtension } from "@/lib/utils";
import CodeView from "./code-view";

type FileCollection = { [path: string]: string };

interface FileExplorerProps {
  files: FileCollection;
}

const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <p>TODO: TREEVIEW</p>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              {/* TODO: File breadcrumb */}
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplorer;
