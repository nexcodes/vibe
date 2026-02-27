import { cn } from "@/lib/utils";
import { AlertTriangleIcon } from "lucide-react";

interface Props {
  variant?: "page" | "panel" | "inline";
  title?: string;
  message?: string;
}

export function ErrorFallback({
  variant = "panel",
  title = "Something went wrong",
  message = "There was an unexpected error. Try refreshing the page.",
}: Props) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-x-2 p-2 border-b text-destructive text-sm">
        <AlertTriangleIcon className="size-4 shrink-0" />
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center px-8",
        variant === "page" ? "h-screen" : "flex-1 h-full",
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10">
        <AlertTriangleIcon className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
