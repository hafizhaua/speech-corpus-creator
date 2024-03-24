import { Skeleton } from "@/components/ui/skeleton";

export default function UtteranceSkeleton() {
  return (
    <div className="p-8 py-12 md:px-10 md:py-12 flex flex-col gap-8">
      <div className="">
        <Skeleton className="w-32 h-8 mb-2" />
        <Skeleton className="w-full h-4" />
      </div>{" "}
      <div className="flex gap-16">
        <div className="">
          <Skeleton className="w-12 h-4 mb-1" />
          <Skeleton className="w-20 h-6 mb-1" />
        </div>
        <div className="">
          <Skeleton className="w-12 h-4 mb-1" />
          <Skeleton className="w-20 h-6 mb-1" />
        </div>
        <div className="">
          <Skeleton className="w-12 h-4 mb-1" />
          <Skeleton className="w-20 h-6 mb-1" />
        </div>
        <div className="">
          <Skeleton className="w-12 h-4 mb-1" />
          <Skeleton className="w-20 h-6 mb-1" />
        </div>
      </div>
      <div className="">
        <Skeleton className="w-20 h-6 mb-4" />

        <div className="">
          <div className="flex flex-col gap-2">
            {Array(5)
              .fill(0)
              .map((val, idx) => {
                return <Skeleton className="w-full h-10" key={idx} />;
              })}
          </div>
        </div>
      </div>
      <Skeleton className="w-full h-12" />
    </div>
  );
}
