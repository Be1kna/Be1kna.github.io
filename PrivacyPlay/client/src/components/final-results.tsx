import { GameState } from "@/hooks/use-game-state";

interface FinalResultsProps {
  gameState: GameState;
  onRestart: () => void;
}

export default function FinalResults({ gameState, onRestart }: FinalResultsProps) {
  const calculateScore = () => {
    let finalScore = 0;
    const messages: string[] = [];

    if (gameState.cameraAllowed) {
        messages.push("⚠️   You allowed camera access without checking what it would be used for.");
    } else {
        messages.push("✅   Good! You didn't allow camera access.");
        finalScore += 1;
    }

    if (gameState.locationAllowed) {
        messages.push("⚠️   You allowed location access without checking what it would be used for.");
        if (gameState.userLocation) {
            messages.push(`📍   We recorded your location: ${gameState.userLocation.latitude.toFixed(4)}, ${gameState.userLocation.longitude.toFixed(4)}`);
        }
    } else {
        messages.push("✅   Good! You didn't allow location access.");
        finalScore += 1;
    }

    messages.push("✅   Good! You made a secure password!");
    finalScore += 1;
    
    let privacyPoints = 0;
    if (gameState.privacyChecked) {
      messages.push("✅   Excellent! You checked the privacy policy.");
      privacyPoints += 1;
    }
    if (gameState.termsChecked) {
      messages.push("✅   Excellent! You checked the terms of use.");
      privacyPoints += 1;
    }
    if (gameState.contactChecked) {
      messages.push("✅   Excellent! You checked the contact information.");
      privacyPoints += 1;
    }
    if (privacyPoints === 0) {
      messages.push("⚠️   You didn't check the privacy policy, terms of use, or contact information.");
    }
    finalScore += privacyPoints;
    
    finalScore += 2;
    messages.push("✅   Smart! You checked the payment processor information before entering card details.");
    
    return { finalScore, messages, totalPossible: 8 };
  };

  const { finalScore, messages, totalPossible } = calculateScore();
  const percentage = Math.round((finalScore / totalPossible) * 100);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground" data-testid="final-score">
            {finalScore}/{totalPossible}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Security Awareness Score: {percentage}%</h2>
        <p className="text-muted-foreground">Here's how you performed in our cybersecurity awareness test</p>
      </div>
      
      {gameState.capturedImage && (
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Here's the image we captured:</p>
          <img 
            src={gameState.capturedImage} 
            className="w-32 h-24 object-cover rounded border mx-auto" 
            alt="Captured from camera"
            data-testid="captured-image"
          />
        </div>
      )}
      
      <div className="space-y-3 mb-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 p-3 rounded-lg ${
              message.startsWith('✅') 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <span className="text-lg">{message.substring(0, 2)}</span>
            <p className="text-sm flex-1">{message.substring(3)}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <h3 className="font-bold text-primary mb-2">🎓 Key Security Lessons:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Always read privacy policies before granting permissions</li>
          <li>• Use strong passwords (8+ chars, numbers, symbols)</li>
          <li>• Verify payment processors before entering card details</li>
          <li>• Be cautious about camera and location access requests</li>
          <li>• Check contact information and terms of service</li>
        </ul>
      </div>
      
      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          data-testid="button-restart"
        >
          Take Test Again
        </button>
      </div>
    </div>
  );
}
