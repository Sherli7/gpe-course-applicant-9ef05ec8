import { useState, useEffect } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  applicationSchema,
  ApplicationFormData,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema
} from '@/schemas/applicationSchema';
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

/* ---------- Utils (sans any) ---------- */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

type BackendOk = { success: true; message?: string; details?: string[] };
type BackendFail = { success: false; message: string; details?: string[] };
type BackendResp = BackendOk | BackendFail;

const hasBooleanSuccess = (v: unknown): v is BackendResp =>
  isRecord(v) && 'success' in v && typeof (v as { success: unknown }).success === 'boolean';

export default function ApplicationForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valeurs par défaut FR conformes au backend
  const defaultValues: Partial<ApplicationFormData> = {
    nom: '',
    prenom: '',
    nationalite: '',
    sexe: 'Homme',
    dateNaissance: '',
    lieuNaissance: '',
    telephone: '',
    email: '',
    organisation: '',
    pays: '',
    departement: '',
    posteActuel: '',
    descriptionTaches: '',
    diplome: '',
    institution: '',
    domaine: '',
    langues: [],
    niveaux: {},
    resultatsAttendus: '',
    autresInfos: '',
    mode: 'Vous-même',
    institutionFinancement: '',
    contactFinancement: '',
    emailContactFinancement: '',
    source: '',
    consentement: false
  };

  const methods = useForm<ApplicationFormData>({
    //resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues
  });

  const { handleSubmit, trigger, getValues, watch, reset } = methods;

  // Charger le brouillon (reset avec partiel typé)
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isRecord(parsed)) {
        reset(parsed as Partial<ApplicationFormData>);
      }
    } catch {
      // ignore si invalide
    }
  }, [reset]);

  // Auto-save (debounce)
  const values = watch();
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
      } catch {/* noop */}
    }, 1000);
    return () => clearTimeout(id);
  }, [values]);

  const validateCurrentStep = async () => {
    const currentSchema = stepSchemas[currentStep - 1];
    try {
      await currentSchema.parseAsync(getValues());
      setStepErrors((p) => ({ ...p, [currentStep]: false }));
      setCompletedSteps((p) => ({ ...p, [currentStep]: true }));
      return true;
    } catch {
      setStepErrors((p) => ({ ...p, [currentStep]: true }));
      setCompletedSteps((p) => ({ ...p, [currentStep]: false }));
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
    const ok = await validateCurrentStep();
    if (ok && currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleEditFromSummary = (step: number) => setCurrentStep(step);

  // Soumission directe des clés FR
  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const API_BASEs = 'https://gpe-yale.edocsflow.com/api';
      const API_BASE = 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE}/candidatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const resultUnknown: unknown = await resp.json().catch(() => ({}));

      if (hasBooleanSuccess(resultUnknown) && resultUnknown.success === true) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        toast({
          title: t('confirmation.title'),
          description: t('confirmation.message')
        });
        methods.reset();
        setCurrentStep(1);
        setCompletedSteps({});
        setStepErrors({});
      } else {
        const message =
          (isRecord(resultUnknown) && typeof resultUnknown.message === 'string'
            ? resultUnknown.message
            : resp.statusText) || 'Submission failed';

        const details =
          isRecord(resultUnknown) && Array.isArray(resultUnknown.details)
            ? `\n- ${resultUnknown.details.join('\n- ')}`
            : '';

        toast({
          title: t('errors.server'),
          description: `${message}${details}`,
          variant: 'destructive'
        });
      }
    } catch {
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

  const hasDraft = typeof window !== 'undefined' && localStorage.getItem(DRAFT_STORAGE_KEY);

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
              onClick={() =>
                toast({ title: 'Brouillon chargé', description: 'Vos données ont été restaurées' })
              }
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
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mt-8">{renderCurrentStep()}</div>

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    {t('navigation.previous')}
                  </Button>

                  {currentStep < TOTAL_STEPS ? (
                    <Button type="button" onClick={handleNext}>
                      {t('navigation.next')}
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
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
