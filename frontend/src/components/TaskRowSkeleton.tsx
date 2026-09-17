export default function TaskRowSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-white/5 py-3">
      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}