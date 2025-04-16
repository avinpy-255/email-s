import { useState, useEffect } from 'react';
import { Download, AlertTriangle, Zap, FileDownIcon } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { Button } from '@/components/ui/button';
import ZipIcon from './ZipIcon';
import DropZone from './DropZone';
import FileItem from './FileItem';
import SizeIndicator from './SizeIndicator';
import ProButton from './ProButton';

// Maximum size in bytes (15 MB)
const MAX_SIZE = 15 * 1024 * 1024;
// Threshold for showing Pro button (10 MB - 66% of max)
const PRO_THRESHOLD = 10 * 1024 * 1024;

const ZipperApp = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);

  // Update total size when files change
  useEffect(() => {
    const newTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalSize(newTotalSize);
  }, [files]);

  // Handle adding new files
  const handleFilesAdded = (newFiles: File[]) => {
    // Reset states when adding new files
    setDownloadUrl(null);
    setIsCrashed(false);
    
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`Added ${newFiles.length} file${newFiles.length !== 1 ? 's' : ''}`);
  };

  // Handle removing a file
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  // Create ZIP
  const handleCreateZip = async () => {
    if (files.length === 0) {
      toast.error("No files to zip");
      return;
    }

    setIsZipping(true);
    setDownloadUrl(null);
    
    // Simulate zipping process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // If total size exceeds MAX_SIZE, simulate crash
    if (totalSize > MAX_SIZE) {
      setIsCrashed(true);
      setIsZipping(false);
      
      // Start healing process after a delay
      setTimeout(() => {
        setIsHealing(true);
        
        // Simulate healing
        setTimeout(() => {
          setIsHealing(false);
          setIsCrashed(false);
          setFiles([]);
          setTotalSize(0);
          toast.success("Zlipper has self-healed! Ready to go again.");
        }, 3000);
      }, 2000);
      
      return;
    }
    
    // Create dummy zip URL 
    // In a real app, we would actually create a zip file here
    const dummyUrl = "#dummy-zip-download";
    setDownloadUrl(dummyUrl);
    setIsZipping(false);
    toast.success("ZIP file created successfully!");
  };

  // Clear all files
  const handleClearFiles = () => {
    setFiles([]);
    setTotalSize(0);
    setDownloadUrl(null);
    toast.info("All files cleared");
  };

  return (
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Hero Section */}
      <div className="text-center mb-8 relative">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-white rounded-xl p-2 mr-2 animate-glow relative">
            <Zap size={24} className="text-black" />
          </div>
          <h1 className="header-title text-4xl md:text-5xl font-light text-white">
            zlipr
          </h1>
          {/* The Pro button will only show when total size exceeds PRO_THRESHOLD */}
          {totalSize >= PRO_THRESHOLD && <ProButton className="ml-2" />}
        </div>
        <p className="text-gray-300 font-light">🛸 Upload it. 💫 Zlipp it. 🌍 Rule the folders</p>
      </div>

      {/* Main Container */}
      <div className="glass-panel p-6 mb-8">
        {/* Upload Area */}
        <DropZone 
          onFilesAdded={handleFilesAdded} 
          disabled={isZipping || isCrashed}
          className="mb-4"
        />
        
        {/* Files List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium">Files ({files.length})</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFiles}
                disabled={isZipping}
              >
                Clear all
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {files.map((file, index) => (
                <FileItem 
                  key={`${file.name}-${index}`}
                  name={file.name}
                  size={file.size}
                  onRemove={() => handleRemoveFile(index)}
                />
              ))}
            </div>
            
            {/* Size Indicator */}
            <div className="mt-4">
              <SizeIndicator currentSize={totalSize} maxSize={MAX_SIZE} />
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg"
            disabled={files.length === 0 || isZipping || isCrashed}
            onClick={handleCreateZip}
            className={files.length > 0 ? "bubble-button px-8 py-6" : ""}
          >
            {isZipping ? (
              <>
                <ZipIcon animating size={20} className="mr-2" /> 
                Creating ZIP...
              </>
            ) : (
              <>
                <ZipIcon size={20} className="mr-2" /> 
                Create ZIP
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Status Section */}
      {(downloadUrl || isCrashed) && (
        <div className={`glass-panel p-6 text-center ${isCrashed ? 'border-red-500/30 shadow-red-500/20' : 'border-zlipper-purple/30'}`}>
          {isCrashed ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertTriangle size={48} className="text-red-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-medium text-red-400">
                Oops... Zlipper zipped itself out 😵‍💫
              </h3>
              <p className="text-gray-400">
                {isHealing 
                  ? "Don't worry, it's healing..." 
                  : "But don't worry, it's about to heal!"}
              </p>
              {isHealing && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin w-10 h-10 border-4 border-zlipper-purple border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileDownIcon size={48} className="text-zlipper-purple animate-bounce" />
              </div>
              <h3 className="text-2xl font-medium text-zlipper-purple">
                Zipping done! You're all packed 🚀
              </h3>
              <Button 
                variant="outline" 
                size="lg"
                className="bubble-button-2 px-8 py-6"
                onClick={() => window.open(downloadUrl!, '_blank')}
              >
                <Download size={18} className="mr-2" />
                Download ZIP
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-gray-500 pb-8">
        <p>Built by Avinash <span className='text-2xl'>🍜</span> </p>
      </footer>
    </div>
  );
};

export default ZipperApp;
