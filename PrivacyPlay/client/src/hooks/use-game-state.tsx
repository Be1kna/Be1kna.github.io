import { useState } from "react";

export interface GameState {
  currentStep: number;
  cameraAllowed: boolean;
  locationAllowed: boolean;
  capturedImage: string | null;
  userLocation: { latitude: number; longitude: number } | null;
  privacyChecked: boolean;
  termsChecked: boolean;
  contactChecked: boolean;
  score: number;
  accountCreated: boolean;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
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

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  return { gameState, updateGameState };
}
