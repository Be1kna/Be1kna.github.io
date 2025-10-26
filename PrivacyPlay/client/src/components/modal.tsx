import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border p-6 max-w-md mx-4 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-close-modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="text-sm text-muted-foreground space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyContent() {
  return (
    <>
      <p>True Snake is a premium gaming platform offering classic Snake gameplay with modern features.</p>
      <p><strong>Data Collection:</strong> We collect minimal data necessary to provide our gaming services. Camera and location data are used for enhanced gameplay features.</p>
      <p><strong>Storage:</strong> Game data and preferences are stored securely to enhance your gaming experience.</p>
      <p><strong>Purpose:</strong> All data collection is designed to provide personalized gaming experiences and improve our services.</p>
      <p><strong>Payments:</strong> We use secure payment processing for premium features and subscriptions.</p>
    </>
  );
}

export function TermsOfUseContent() {
  return (
    <>
      <p><strong>Gaming Service:</strong> True Snake provides premium gaming services including unlimited lives, power-ups, and exclusive content.</p>
      <p><strong>Payment Terms:</strong> Daily subscriptions are charged at $0.15/day and can be cancelled anytime.</p>
      <p><strong>Account Security:</strong> Users are responsible for maintaining secure passwords and account information.</p>
      <p><strong>Game Features:</strong> Premium users gain access to advanced features, customization options, and exclusive gameplay modes.</p>
      <p><strong>Liability:</strong> True Snake is not responsible for any gaming addiction or time spent playing our games.</p>
    </>
  );
}

export function ContactContent() {
  return (
    <>
      <div className="flex items-center space-x-3">
        <i className="fas fa-user text-primary"></i>
        <span>Fantik</span>
      </div>
      <div className="flex items-center space-x-3">
        <i className="fas fa-envelope text-primary"></i>
        <span>yulianav148@edu.sd45.bc.ca</span>
      </div>
      <div className="flex items-center space-x-3">
        <i className="fas fa-globe text-primary"></i>
        <span>https://knowledgeflow.org/initiative/unhackathon-2025/</span>
      </div>
      <div className="pt-3 border-t border-border">
        <p className="text-muted-foreground text-xs">True Snake - Classic gaming experience</p>
      </div>
    </>
  );
}
