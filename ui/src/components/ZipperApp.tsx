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
const PRO_THRESHOLD = 10 * 1024 * 1024; // http://192.168.49.2:30081
const BACKEND_URL = "http://192.168.49.2:30081";
const UPLOAD_URL = BACKEND_URL + "/upload";
// Backend health check endpoint
const HEALTH_CHECK_URL =  BACKEND_URL +"/health";
// Health check interval in milliseconds
const HEALTH_CHECK_INTERVAL = 2000;

const ZipperApp = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isHealing, setIsHealing] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [healthCheckActive, setHealthCheckActive] = useState(false);
  const [recoveryCountdown, setRecoveryCountdown] = useState(0);
  const [serverWasDown, setServerWasDown] = useState(false);

  // Update total size when files change
  useEffect(() => {
    const newTotalSize = files.reduce((acc, file) => acc + file.size, 0);
    setTotalSize(newTotalSize);
  }, [files]);

  // Health check effect
  useEffect(() => {
    let healthCheckTimer: number | null = null;
    
    // Only run health checks when needed
    if (healthCheckActive) {      console.log("Health check active, starting interval checks");      
       const checkBackendHealth = async () => {
        try {
          console.log("Checking backend health...");
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const response = await fetch(HEALTH_CHECK_URL, {
            method: 'GET',
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
          });

          clearTimeout(timeoutId);

          // Updated to accept both 200 and 204 responses as valid
          if (response.ok) {  // This will accept any 2xx status code
            console.log("Backend health check succeeded with status:", response.status);
            // If server was previously down and now it's up, handle recovery
            if (serverWasDown) {
              console.log("Server has recovered!");
              toast.success("Backend service has recovered!");
              setIsHealing(false);
              setRecoveryCountdown(3);
              setServerWasDown(false);
            }
          } else {
            console.log("Backend returned error status:", response.status);
            if (!serverWasDown) {
              setServerWasDown(true);
              setIsCrashed(true);
              setIsHealing(true);
            }
          }
        } catch (error) {
          console.log("Backend health check failed:", error);
          // Network error means backend is down
          if (!serverWasDown) {
            setServerWasDown(true);
            setIsCrashed(true);
            setIsHealing(true);
            toast.error("Server is down! Self-healing in progress...");
          }
        }
      };

          checkBackendHealth();

          healthCheckTimer = window.setInterval(checkBackendHealth, HEALTH_CHECK_INTERVAL);
        }
    
    return () => {
      if (healthCheckTimer !== null) {
        console.log("Cleaning up health check timer");
        window.clearInterval(healthCheckTimer);
      }
    };
  }, [healthCheckActive, serverWasDown]);

  // Recovery countdown effect
  useEffect(() => {
    let countdownTimer: number | null = null;
    
    if (recoveryCountdown > 0) {
      console.log(`Recovery countdown: ${recoveryCountdown}`);
      countdownTimer = window.setInterval(() => {
        setRecoveryCountdown(prev => {
          if (prev <= 1) {
            console.log("Countdown finished, resetting UI");
            resetUI();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownTimer !== null) {
        window.clearInterval(countdownTimer);
      }
    };
  }, [recoveryCountdown]);

  // Reset the entire UI state
  const resetUI = () => {
    console.log("Resetting UI state");
    setFiles([]);
    setTotalSize(0);
    setDownloadUrl(null);
    setIsCrashed(false);
    setIsHealing(false);
    setHealthCheckActive(false);
    setRecoveryCountdown(0);
    setServerWasDown(false);
    toast.info("UI reset complete - ready for new files");
  };

  // Handle adding new files
  const handleFilesAdded = (newFiles: File[]) => {
    // Reset states when adding new files
    setDownloadUrl(null);
    setIsCrashed(false);
    setIsHealing(false);
    setHealthCheckActive(false);
    setRecoveryCountdown(0);
    
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
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
  
      // Check if total size exceeds limit
      if (totalSize > MAX_SIZE) {
        console.log("Large file upload detected (> 15MB), expecting server crash");
        // Start health checks BEFORE sending the request that might crash the server
        setHealthCheckActive(true);
      }
      
      
      const controller = new AbortController();
      
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(UPLOAD_URL, {
         method: "POST",
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 413) {
            toast.error("Files too large! Max size is 15MB.");
          } else {
            throw new Error(`Upload failed with status ${response.status}`);
          }
        } else {
          const data = await response.json();
          setDownloadUrl(BACKEND_URL + "/download/zlipr.zip");
          toast.success("ZIP file created successfully!");
        }
      } catch (error) {
        console.error("Error during upload:", error);
        
        // If the request was aborted or network error occurred
        if (error.name === 'AbortError' || error instanceof TypeError) {
          console.log("Network error or timeout - checking if server crashed");
          setServerWasDown(true);
          setIsCrashed(true);
          setIsHealing(true);
          setHealthCheckActive(true);
          toast.error("Server crashed! Self-healing in progress...");
        } else {
          toast.error("Something went wrong during ZIP creation.");
        }
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      toast.error("An unexpected error occurred");
    } finally {
      setIsZipping(false);
    }
  };

  // Clear all files
  const handleClearFiles = () => {
    resetUI();
  };

  // Force crash for testing
  const simulateCrash = () => {
    setServerWasDown(true);
    setIsCrashed(true);
    setIsHealing(true);
    setHealthCheckActive(true);
    toast.error("Simulated server crash! Testing self-healing...");
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
              {/* Warning when exceeds size limit */}
              {totalSize > MAX_SIZE && (
                <div className="text-red-400 text-sm mt-1 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  Exceeds 15MB limit - this will crash the server (but it'll self-heal!)
                </div>
              )}
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
                {recoveryCountdown > 0 
                  ? `Server recovered! Resetting UI in ${recoveryCountdown}...` 
                  : isHealing 
                    ? "Self-healing in progress... Please wait" 
                    : "But don't worry, it's about to heal!"}
              </p>
              {isHealing && (
                <div className="flex flex-col items-center mt-4">
                  <div className="animate-spin w-10 h-10 border-4 border-zlipper-purple border-t-transparent rounded-full mb-3" />
                  <p className="text-sm text-gray-400">
                    Kubernetes/Docker is working on it...
                    <></>
                  </p>
                </div>
              )}
              {recoveryCountdown > 0 && (
                <div className="flex flex-col items-center mt-4">
                  <div className="w-10 h-10 border-4 border-green-500 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-green-500 font-bold">{recoveryCountdown}</span>
                  </div>
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