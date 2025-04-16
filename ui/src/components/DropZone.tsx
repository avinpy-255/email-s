
import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type DropZoneProps = {
  onFilesAdded: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

const DropZone = ({ onFilesAdded, className, disabled = false }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [disabled, onFilesAdded]);
  
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files?.length) return;
    
    const files = Array.from(e.target.files);
    onFilesAdded(files);
    
    // Reset the input
    e.target.value = '';
  }, [disabled, onFilesAdded]);

  return (
    <div 
      className={cn(
        'drop-zone min-h-[200px] cursor-pointer',
        isDragging && 'drop-zone-active',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled) {
          document.getElementById('fileInput')?.click();
        }
      }}
    >
      <input 
        type="file" 
        id="fileInput"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      <div className="text-center p-6">
        <div className="mb-4 flex justify-center">
          <div className={cn(
            "p-4 rounded-full bg-white/5",
            isDragging ? "shadow-neon animate-pulse" : ""
          )}>
            <Upload 
              size={32} 
              className={cn(
                "text-white/70",
                isDragging ? "text-zlipper-purple" : ""
              )} 
            />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </h3>
        <p className="text-sm text-gray-400">
          or <span className="text-zlipper-purple">click to browse</span>
        </p>
      </div>
    </div>
  );
};

export default DropZone;
