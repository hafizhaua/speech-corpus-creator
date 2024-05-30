import { Skeleton } from "@/components/ui/skeleton";

export default function EditSkeleton() {
  return (
    <div className="px-6 py-10  md:px-10 md:py-12 flex flex-col gap-4">
      <div className="">
        <Skeleton className="w-48 h-8 mb-2" />
      </div>{" "}
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((val, idx) => {
            return (
              <div className="space-y-2" key={idx}>
                <Skeleton className={`w-16 h-6`} />
                <Skeleton className="w-full h-8" />
              </div>
            );
          })}
        <div className="space-y-2">
          <Skeleton className={`w-16 h-6`} />
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-full h-12" />
        </div>
        <Skeleton className="w-full h-8" />
      </div>
    </div>
  );
}
