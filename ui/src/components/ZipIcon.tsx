
import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type ZipIconProps = {
  size?: number;
  animating?: boolean;
  className?: string;
}

const ZipIcon = ({ size = 24, animating = false, className }: ZipIconProps) => {
  return (
    <div className={cn(
      "relative inline-flex items-center justify-center bg-white rounded-lg p-1",
      animating && "animate-zip",
      className
    )}>
      <Zap 
        size={size} 
        className="text-black"
        strokeWidth={2} 
      />
    </div>
  );
};

export default ZipIcon;
