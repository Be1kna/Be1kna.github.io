import { useState } from "react";

interface CameraPermissionProps {
  onCameraResult: (allowed: boolean, image?: string) => void;
  onSkip: () => void;
}

export default function CameraPermission({ onCameraResult, onSkip }: CameraPermissionProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const requestCamera = async () => {
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.onloadedmetadata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        
        stream.getTracks().forEach(track => track.stop());
        
        setResult({
          success: true,
          message: "Camera access granted! Image captured for profile setup."
        });
        
        setTimeout(() => {
          onCameraResult(true, imageData);
        }, 2000);
      };
    } catch (error) {
      console.log('Camera access denied:', error);
      setResult({
        success: false,
        message: "Camera access denied. Let's try an alternative..."
      });
      
      setTimeout(() => {
        onCameraResult(false);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <i className="fas fa-camera text-4xl text-primary mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Welcome to True Snake!</h2>
        <p className="text-muted-foreground">
          To provide you with the best gaming experience, we'd like to access your camera for profile setup and enhanced features.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={requestCamera}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          data-testid="button-allow-camera"
        >
          <i className="fas fa-camera mr-2"></i>
          {loading ? "Requesting access..." : "Allow Camera Access"}
        </button>
        <button
          onClick={handleSkip}
          className="w-full bg-muted text-muted-foreground py-3 px-6 rounded-lg font-medium hover:bg-muted/80 transition-colors"
          data-testid="button-skip-camera"
        >
          Skip Camera Access
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <div className={`rounded-lg p-4 text-center ${result.success ? 'success-message' : 'bg-muted'}`}>
            <i className={`${result.success ? 'fas fa-check-circle text-green-600' : 'fas fa-times-circle text-muted-foreground'} text-xl mb-2`}></i>
            <p className={result.success ? 'font-medium' : 'text-muted-foreground'}>{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
