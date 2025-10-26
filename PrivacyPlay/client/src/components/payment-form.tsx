import { useState } from "react";

interface PaymentFormProps {
  onPayKeeper: () => void;
}

export default function PaymentForm({ onPayKeeper }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  const [cvv, setCvv] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [formOpacity, setFormOpacity] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, boolean> = {};
    
    if (!cardNumber.trim()) newErrors.cardNumber = true;
    if (!expiry.trim()) newErrors.expiry = true;
    if (!cvv.trim()) newErrors.cvv = true;
    if (!cardholder.trim()) newErrors.cardholder = true;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setShowWarning(true);
      setFormOpacity(0.5);
    }
  };

  const resetForm = () => {
    setShowWarning(false);
    setFormOpacity(1);
    setErrors({});
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setCardholder("");
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <i className="fas fa-crown text-4xl text-accent mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Unlock Premium Gaming</h2>
        <p className="text-muted-foreground">
          Get unlimited lives and exclusive power-ups for just $0.15/day
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: formOpacity }}>
        <div>
          <label htmlFor="card-number" className="block text-sm font-medium mb-2">Card Number</label>
          <input
            type="text"
            id="card-number"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid="input-card-number"
          />
          {errors.cardNumber && (
            <div className="mt-1 text-sm text-destructive">Please enter your card information</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium mb-2">Expiry Date</label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              data-testid="input-expiry"
            />
            {errors.expiry && (
              <div className="mt-1 text-sm text-destructive">Please enter expiry date</div>
            )}
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium mb-2">CVV</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              data-testid="input-cvv"
            />
            {errors.cvv && (
              <div className="mt-1 text-sm text-destructive">Please enter CVV</div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="cardholder" className="block text-sm font-medium mb-2">Cardholder Name</label>
          <input
            type="text"
            id="cardholder"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid="input-cardholder"
          />
          {errors.cardholder && (
            <div className="mt-1 text-sm text-destructive">Please enter cardholder name</div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-accent text-accent-foreground py-3 px-6 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          data-testid="button-pay"
        >
          <i className="fas fa-credit-card mr-2"></i>
          Pay $0.15/day
        </button>
      </form>

      {showWarning && (
        <div className="mt-6 security-warning rounded-lg p-4" data-testid="payment-warning">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-destructive text-xl mt-1"></i>
            <div>
              <h3 className="font-bold text-destructive mb-2">Security Alert!</h3>
              <p className="text-sm mb-4">
                You could have been hacked! Never enter card information before checking if it's safe to do so.
              </p>
              <button
                onClick={resetForm}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-medium hover:bg-destructive/90 transition-colors"
                data-testid="button-try-again-payment"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={onPayKeeper}
          className="paykeeper-logo text-xs hover:opacity-80 transition-opacity"
          data-testid="button-paykeeper"
        >
          PayKeeper Ltd.
        </button>
        <p className="text-xs text-muted-foreground mt-1">Secure payment processing</p>
      </div>
    </div>
  );
}
