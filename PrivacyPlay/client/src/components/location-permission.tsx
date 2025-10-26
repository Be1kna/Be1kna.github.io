import { useState } from "react";

interface LocationPermissionProps {
  onLocationResult: (allowed: boolean, location?: { latitude: number; longitude: number }) => void;
}

export default function LocationPermission({ onLocationResult }: LocationPermissionProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const requestLocation = async () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      setResult({
        success: false,
        message: "Location access denied. Proceeding without location data."
      });
      setTimeout(() => onLocationResult(false), 1500);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        setResult({
          success: true,
          message: "Location access granted! Your location has been recorded."
        });
        
        setTimeout(() => {
          onLocationResult(true, location);
        }, 2000);
        setLoading(false);
      },
      (error) => {
        console.log('Location access denied:', error);
        setResult({
          success: false,
          message: "Location access denied. Proceeding without location data."
        });
        setTimeout(() => onLocationResult(false), 1500);
        setLoading(false);
      }
    );
  };

  const handleSkip = () => {
    setTimeout(() => onLocationResult(false), 500);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <i className="fas fa-map-marker-alt text-4xl text-secondary mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Location Access</h2>
        <p className="text-muted-foreground">
          We'd also like to access your location to provide region-specific gaming features and leaderboards.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={requestLocation}
          disabled={loading}
          className="w-full bg-secondary text-secondary-foreground py-3 px-6 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
          data-testid="button-allow-location"
        >
          <i className="fas fa-map-marker-alt mr-2"></i>
          {loading ? "Requesting access..." : "Allow Location Access"}
        </button>
        <button
          onClick={handleSkip}
          className="w-full bg-muted text-muted-foreground py-3 px-6 rounded-lg font-medium hover:bg-muted/80 transition-colors"
          data-testid="button-skip-location"
        >
          Skip Location Access
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
