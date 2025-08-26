import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  errors: Record<number, boolean>;
  completedSteps: Record<number, boolean>;
}

export function Stepper({ currentStep, totalSteps, errors, completedSteps }: StepperProps) {
  const { t } = useTranslation();

  const getStepIcon = (step: number) => {
    if (errors[step]) {
      return <AlertCircle className="w-5 h-5" />;
    }
    if (completedSteps[step] && step < currentStep) {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <Circle className="w-5 h-5" />;
  };

  const getStepStatus = (step: number) => {
    if (errors[step]) return 'error';
    if (completedSteps[step] && step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="w-full py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            {t('progress.step', { current: currentStep, total: totalSteps })}
          </span>
          <span className="text-sm font-medium text-primary">
            {t('progress.complete', { percent: Math.round((currentStep - 1) / totalSteps * 100) })}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-1">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const status = getStepStatus(step);
          
          return (
            <div 
              key={step} 
              className="flex flex-col items-center space-y-2 min-w-0"
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                {
                  "bg-destructive border-destructive text-destructive-foreground": status === 'error',
                  "bg-primary border-primary text-primary-foreground": status === 'completed' || status === 'active',
                  "bg-muted border-muted-foreground text-muted-foreground": status === 'inactive'
                }
              )}>
                {getStepIcon(step)}
              </div>
              
              <div className="text-center max-w-20">
                <span className={cn(
                  "text-xs font-medium leading-tight break-words",
                  {
                    "text-destructive": status === 'error',
                    "text-primary": status === 'active' || status === 'completed',
                    "text-muted-foreground": status === 'inactive'
                  }
                )}>
                  {t(`stepper.step${step}`)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}