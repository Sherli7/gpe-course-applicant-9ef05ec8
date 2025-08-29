import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { applicationSchema, ApplicationFormData, step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from '@/schemas/applicationSchema';
import { Header } from '@/components/Header';
import { Stepper } from '@/components/Stepper';
import { Step1GeneralInfo } from '@/components/steps/Step1GeneralInfo';
import { Step2ProfessionalDetails } from '@/components/steps/Step2ProfessionalDetails';
import { Step3Education } from '@/components/steps/Step3Education';
import { Step4AdditionalInfo } from '@/components/steps/Step4AdditionalInfo';
import { Step5Funding } from '@/components/steps/Step5Funding';
import { Step6Summary } from '@/components/steps/Step6Summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 6;
const DRAFT_STORAGE_KEY = 'application-draft';

const stepSchemas = [
  step1Schema,
  step2Schema, 
  step3Schema,
  step4Schema,
  step5Schema,
  applicationSchema
];

export default function ApplicationForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues: {
      langues: [],
      niveaux: {},
      consentement: false
    }
  });

  const { handleSubmit, trigger, getValues, setValue, watch } = methods;

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        Object.keys(parsedDraft).forEach(key => {
          setValue(key as keyof ApplicationFormData, parsedDraft[key]);
        });
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [setValue]);

  // Auto-save draft
  const values = watch();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [values]);

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep - 1];
    try {
      await currentSchema.parseAsync(getValues());
      setStepErrors(prev => ({ ...prev, [currentStep]: false }));
      setCompletedSteps(prev => ({ ...prev, [currentStep]: true }));
      return true;
    } catch (error) {
      setStepErrors(prev => ({ ...prev, [currentStep]: true }));
      setCompletedSteps(prev => ({ ...prev, [currentStep]: false }));
      
      // Trigger validation to show field errors
      await trigger();
      
      toast({
        title: t('validation.errors'),
        description: t('errors.validation'),
        variant: 'destructive'
      });
      
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = async (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleEditFromSummary = (step: number) => {
    setCurrentStep(step);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      const API_BASEs = 'https://gpe-yale.edocsflow.com/api';
      const API_BASE = 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE}/candidatures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        toast({
          title: t('confirmation.title'),
          description: t('confirmation.message'),
          variant: 'default'
        });
        
        // Reset form for new application
        methods.reset();
        setCurrentStep(1);
        setCompletedSteps({});
        setStepErrors({});
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      toast({
        title: t('errors.server'),
        description: t('errors.network'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo />;
      case 2:
        return <Step2ProfessionalDetails />;
      case 3:
        return <Step3Education />;
      case 4:
        return <Step4AdditionalInfo />;
      case 5:
        return <Step5Funding />;
      case 6:
        return <Step6Summary onEdit={handleEditFromSummary} />;
      default:
        return <Step1GeneralInfo />;
    }
  };

  const hasDraft = localStorage.getItem(DRAFT_STORAGE_KEY);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {hasDraft && currentStep === 1 && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium text-primary mb-2">
              {t('navigation.resumeDraft')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Draft is already loaded in useEffect
                toast({
                  title: "Brouillon chargé",
                  description: "Vos données ont été restaurées",
                });
              }}
            >
              {t('navigation.resumeDraft')}
            </Button>
          </div>
        )}

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <Stepper
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              errors={stepErrors}
              completedSteps={completedSteps}
            />

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-8">
                  {renderCurrentStep()}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    {t('navigation.previous')}
                  </Button>

                  {currentStep < TOTAL_STEPS ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                    >
                      {t('navigation.next')}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Envoi...' : t('navigation.submit')}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}