const shimmerStyle = {
  backgroundSize: "200% 100%",
  backgroundImage: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--accent)) 50%, hsl(var(--muted)) 75%)",
};

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-card border border-border">
    <div className="h-48 bg-muted animate-shimmer" style={shimmerStyle} />
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-muted rounded-lg w-3/5 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.1s" }} />
        <div className="h-5 bg-muted rounded-lg w-12 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.15s" }} />
      </div>
      <div className="h-4 bg-muted rounded-lg w-2/5 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.2s" }} />
      <div className="flex gap-2">
        <div className="h-5 bg-muted rounded-full w-16 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.25s" }} />
        <div className="h-5 bg-muted rounded-full w-20 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.3s" }} />
        <div className="h-5 bg-muted rounded-full w-14 animate-shimmer" style={{ ...shimmerStyle, animationDelay: "0.35s" }} />
      </div>
    </div>
  </div>
);

export const SkeletonSection = ({ count = 4 }: { count?: number }) => (
  <div className="mb-12">
    <div className="h-7 bg-muted rounded-lg w-48 mb-6 animate-shimmer" style={shimmerStyle} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default SkeletonCard;
