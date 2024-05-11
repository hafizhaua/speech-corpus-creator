import React from "react";
import { Skeleton } from "../ui/skeleton";

export const SkeletonAuthProfile = () => {
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden border rounded-lg px-6 py-2 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="w-6 h-6 md:w-8 md:h-8 rounded-full" />
          <Skeleton className="flex-1 h-10" />
        </div>
      </div>
    </div>
  );
};
