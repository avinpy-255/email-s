import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type SizeIndicatorProps = {
  currentSize: number;
  maxSize: number;
  className?: string;
}

const SizeIndicator = ({ currentSize, maxSize, className }: SizeIndicatorProps) => {
  const percentage = Math.min((currentSize / maxSize) * 100, 100);
  const isWarning = percentage > 80;
  const isDanger = percentage > 95;

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span>Total Size</span>
        <span className={cn(
          isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-muted-foreground"
        )}>
          {formatFileSize(currentSize)} of {formatFileSize(maxSize)} max
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isDanger ? "bg-red-900/20" : isWarning ? "bg-amber-900/20" : "bg-white/5"
        )}
        indicatorClassName={cn(
          isDanger 
            ? "bg-gradient-to-r from-red-500 to-red-400" 
            : isWarning 
              ? "bg-gradient-to-r from-amber-500 to-amber-400" 
              : "bg-gradient-to-r from-zlipper-purple to-zlipper-pink"
        )}
      />
    </div>
  );
};

export default SizeIndicator;
