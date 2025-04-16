import { File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FileItemProps = {
  name: string;
  size: number;
  onRemove: () => void;
  className?: string;
}

const FileItem = ({ name, size, onRemove, className }: FileItemProps) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-3 mb-2 rounded-lg glass-panel group",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zlipper-purple/20 rounded-lg">
          <File size={16} className="text-zlipper-purple" />
        </div>
        <div>
          <p className="text-sm font-medium truncate max-w-[200px]">{name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
        </div>
      </div>
      <button 
        onClick={onRemove} 
        className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
      >
        <X size={14} className="text-gray-400 hover:text-white" />
      </button>
    </div>
  );
};

export default FileItem;
