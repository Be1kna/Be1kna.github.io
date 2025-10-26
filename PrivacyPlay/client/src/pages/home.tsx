import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import StepProgress from "@/components/step-progress";
import CameraPermission from "@/components/camera-permission";
import LocationPermission from "@/components/location-permission";
import AccountCreation from "@/components/account-creation";
import SnakeGame from "@/components/snake-game";
import PaymentForm from "@/components/payment-form";
import FinalResults from "@/components/final-results";
import Modal, { PrivacyPolicyContent, TermsOfUseContent, ContactContent } from "@/components/modal";

export default function Home() {
  const { gameState, updateGameState } = useGameState();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleCameraResult = (allowed: boolean, image?: string) => {
    updateGameState({ 
      cameraAllowed: allowed, 
      capturedImage: image || null 
    });
    
    // Always go to location step regardless of camera permission
    setTimeout(() => updateGameState({ currentStep: 1.5 }), 500);
  };

  const handleLocationResult = (allowed: boolean, location?: { latitude: number; longitude: number }) => {
    updateGameState({ 
      locationAllowed: allowed, 
      userLocation: location || null 
    });
    setTimeout(() => updateGameState({ currentStep: 2 }), 500);
  };

  const handleAccountCreated = () => {
    updateGameState({ accountCreated: true, currentStep: 2.5 });
  };

  const handleGameOver = () => {
    updateGameState({ currentStep: 3 });
  };

  const handlePayKeeper = () => {
    updateGameState({ currentStep: 4 });
  };

  const handleRestart = () => {
    updateGameState({
      currentStep: 1,
      cameraAllowed: false,
      locationAllowed: false,
      capturedImage: null,
      userLocation: null,
      privacyChecked: false,
      termsChecked: false,
      contactChecked: false,
      score: 0,
      accountCreated: false,
    });
  };

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
    if (modalType === 'privacy') updateGameState({ privacyChecked: true });
    if (modalType === 'terms') updateGameState({ termsChecked: true });
    if (modalType === 'contact') updateGameState({ contactChecked: true });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderCurrentStep = () => {
    switch (gameState.currentStep) {
      case 1:
        return (
          <CameraPermission
            onCameraResult={handleCameraResult}
            onSkip={() => updateGameState({ currentStep: 1.5 })}
          />
        );
      case 1.5:
        return <LocationPermission onLocationResult={handleLocationResult} />;
      case 2:
        return <AccountCreation onAccountCreated={handleAccountCreated} />;
      case 2.5:
        return <SnakeGame onGameOver={handleGameOver} />;
      case 3:
        return <PaymentForm onPayKeeper={handlePayKeeper} />;
      case 4:
        return <FinalResults gameState={gameState} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-gamepad text-primary-foreground text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold">True Snake</h1>
                <p className="text-sm text-muted-foreground">Classic Gaming Experience</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => openModal('privacy')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-privacy-policy"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openModal('terms')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-terms"
              >
                Terms of Use
              </button>
              <button
                onClick={() => openModal('contact')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-contact"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {renderCurrentStep()}
      </main>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={closeModal}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </Modal>

      <Modal
        isOpen={activeModal === 'terms'}
        onClose={closeModal}
        title="Terms of Use"
      >
        <TermsOfUseContent />
      </Modal>

      <Modal
        isOpen={activeModal === 'contact'}
        onClose={closeModal}
        title="Contact Information"
      >
        <ContactContent />
      </Modal>
    </div>
  );
}
