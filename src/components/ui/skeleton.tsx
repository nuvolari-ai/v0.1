import { cn } from "@nuvolari/lib/utils";
import { type ReactNode } from "react";

export type SkeletonProps = React.ComponentProps<"div"> & {
  loading: boolean;
  children: ReactNode;
};

function Skeleton({ className, loading, children, ...props }: SkeletonProps) {
  return loading ? (
    <div
      data-slot="skeleton"
      className={cn("bg-primary/10 animate-pulse rounded-md", className)}
      {...props}
    />
  ) : (
    children
  );
}

export { Skeleton };
