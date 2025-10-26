interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { id: 1, name: "Permissions" },
    { id: 2, name: "Account & Game" },
    { id: 3, name: "Payment" }
  ];

  return (
    <div className="step-indicator rounded-lg p-4 mb-8 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    Math.ceil(currentStep) === step.id 
                      ? 'bg-white text-primary' 
                      : 'bg-white bg-opacity-20'
                  }`}
                  data-testid={`step-indicator-${step.id}`}
                >
                  {step.id}
                </div>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-white bg-opacity-30 ml-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
