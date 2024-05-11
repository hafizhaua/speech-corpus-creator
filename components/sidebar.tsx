import { Suspense } from "react";
import { AuthProfile } from "./auth-profile";
import { MyUtteranceLibrary } from "./my-utterance-library";
import { SkeletonAuthProfile } from "./skeleton.tsx/skeleton-auth-profile";
import { SkeletonUtteranceLibrary } from "./skeleton.tsx/skeleton-utterance-library";

export const Sidebar = () => {
  return (
    <div className="h-screen hidden md:flex gap-4 flex-col items-center p-4">
      <Suspense fallback={<SkeletonAuthProfile />}>
        <AuthProfile />
      </Suspense>
      <Suspense fallback={<SkeletonUtteranceLibrary />}>
        <MyUtteranceLibrary />
      </Suspense>
    </div>
  );
};
