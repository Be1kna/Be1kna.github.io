import { useState } from "react";

interface AccountCreationProps {
  onAccountCreated: () => void;
}

export default function AccountCreation({ onAccountCreated }: AccountCreationProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formOpacity, setFormOpacity] = useState(1);

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    
    return { hasMinLength, hasDigit, hasSymbol, isValid: hasMinLength && hasDigit && hasSymbol };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      setShowWarning(true);
      setFormOpacity(0.5);
    } else {
      onAccountCreated();
    }
  };

  const resetForm = () => {
    setShowWarning(false);
    setFormOpacity(1);
    setPassword("");
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      emailInput?.focus();
    }, 100);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <i className="fas fa-gamepad text-4xl text-accent mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Create Account to Play!</h2>
        <p className="text-muted-foreground">
          Join our gaming platform and test your skills with our classic Snake game.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: formOpacity }}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="your.email@example.com"
            required
            data-testid="input-email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Enter a secure password"
            required
            data-testid="input-password"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            Password must be 8+ characters with at least 1 digit and 1 symbol
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-accent-foreground py-3 px-6 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          data-testid="button-create-account"
        >
          Create Account & Start Playing
        </button>
      </form>

      {showWarning && (
        <div className="mt-6 security-warning rounded-lg p-4" data-testid="password-warning">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-destructive text-xl mt-1"></i>
            <div>
              <h3 className="font-bold text-destructive mb-2">Security Alert: Your Account Was Compromised!</h3>
              <p className="text-sm mb-4">
                Your email has been hacked due to a weak password. Next time, ensure your password is 8+ characters long with at least 1 digit and 1 symbol.
              </p>
              <button
                onClick={resetForm}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors"
                data-testid="button-try-again"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
