import { useState, useEffect } from 'react';
import { useForm, FormProvider, type SubmitHandler, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  applicationSchema,
  ApplicationFormData,
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema
} from '@/schemas/applicationSchema';
import { mapFormToBackend } from '@/lib/formMappers';
import { mapFormToBackend } from '@/lib/formMappers';
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
const DRAFT_STORAGE_KEY = 'application-draft';
const API_BASE = 'https://gpe-yale.edocsflow.com/api';

const stepSchemas = [ step1Schema, step2Schema, step3Schema, step4Schema, step5Schema, applicationSchema ];

/* ---------- Utils ---------- */
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

type BackendOk = { success: true; message?: string; id?: number; uuid?: string; dateSoumission?: string };
type BackendFail = { success: false; message: string; details?: string[] };
type BackendResp = BackendOk | BackendFail;
const hasBooleanSuccess = (v: unknown): v is BackendResp =>
  isRecord(v) && 'success' in v && typeof (v as { success: unknown }).success === 'boolean';

type BackendValidationItem = {
  property?: string;
  constraints?: Record<string, string>;
};

const backendToFrontendField: Record<string, { field: keyof ApplicationFormData; step: number }> = {
  firstName: { field: 'prenom', step: 1 },
  lastName: { field: 'nom', step: 1 },
  nationality: { field: 'nationalite', step: 1 },
  gender: { field: 'sexe', step: 1 },
  dateOfBirth: { field: 'dateNaissance', step: 1 },
  placeOfBirth: { field: 'lieuNaissance', step: 1 },
  phoneNumber: { field: 'telephone', step: 1 },
  email: { field: 'email', step: 1 },
  organization: { field: 'organisation', step: 1 },
  country: { field: 'pays', step: 1 },

  department: { field: 'departement', step: 2 },
  currentPosition: { field: 'posteActuel', step: 2 },
  taskDescription: { field: 'descriptionTaches', step: 2 },

  diploma: { field: 'diplome', step: 3 },
  institution: { field: 'institution', step: 3 },
  field: { field: 'domaine', step: 3 },
  languages: { field: 'langues', step: 3 },
  languageLevels: { field: 'niveaux', step: 3 },

  expectedResults: { field: 'resultatsAttendus', step: 4 },
  otherInformation: { field: 'autresInfos', step: 4 },

  fundingSource: { field: 'mode', step: 5 },
  institutionName: { field: 'institutionFinancement', step: 5 },
  contactPerson: { field: 'contactFinancement', step: 5 },
  contactEmail: { field: 'emailContactFinancement', step: 5 },
  informationSource: { field: 'source', step: 5 },
  consent: { field: 'consentement', step: 5 },
};

const mapConstraintToMessageKey = (constraint: string): string => {
  if (constraint === 'isNotEmpty') return 'validation.required';
  if (constraint === 'isDateString') return 'validation.invalidDate';
  if (constraint === 'isEmail') return 'validation.email';
  return 'validation.errors';
};

export default function ApplicationForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = stepSchemas.length;

  // Valeurs par défaut conformes au backend
  const defaultValues: Partial<ApplicationFormData> = {
    nom: '', prenom: '', nationalite: '', sexe: 'Homme',
    dateNaissance: '', lieuNaissance: '', telephone: '', email: '',
    organisation: '', pays: '',
    departement: '', posteActuel: '', descriptionTaches: '',
    diplome: '', institution: '', domaine: '',
    langues: [], niveaux: {},
    resultatsAttendus: '', autresInfos: '',
    mode: 'Vous-même',
    institutionFinancement: '', contactFinancement: '', emailContactFinancement: '',
    source: '', consentement: false
  };

  const methods = useForm<ApplicationFormData>({
    mode: 'onChange',
    defaultValues
  });

  const { handleSubmit, trigger, getValues, watch, reset, setError } = methods;

  // Charger le brouillon
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (isRecord(parsed)) reset(parsed as Partial<ApplicationFormData>);
    } catch { /* ignore */ }
  }, [reset]);

  // Auto-save (debounce)
  const values = watch();
  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values)); } catch { /* noop */ }
    }, 800);
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
      toast({ title: t('validation.errors'), description: t('errors.validation'), variant: 'destructive' });
      return false;
    }
  };

  const handleNext = async () => {
    const ok = await validateCurrentStep();
    if (ok && currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };
  const handleEditFromSummary = (step: number) => setCurrentStep(step);

  // Soumission
  const EMAIL_FIELD: FieldPath<ApplicationFormData> = 'email';
  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = mapFormToBackend(data);

      const response = await fetch(`${API_BASE}/candidatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (response.status === 409) {
        const payload = (await response.json()) as BackendFail | Record<string, unknown>;
        const msg = (isRecord(payload) && typeof payload.message === 'string')
          ? payload.message
          : t('errors.emailAlreadyUsed', 'Une candidature avec cet email existe déjà.');
        setError(EMAIL_FIELD, { type: 'conflict', message: msg });
        setCurrentStep(1);
        setIsSubmitting(false);
        return;
      }

      const resultUnknown: unknown = await response.json().catch(() => ({}));

      if (hasBooleanSuccess(resultUnknown) && resultUnknown.success === true) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        toast({ title: t('confirmation.title'), description: t('confirmation.message') });
        methods.reset(defaultValues);
        setCurrentStep(1);
        setCompletedSteps({});
        setStepErrors({});
      } else {
        // Try to parse structured validation errors from backend
        if (isRecord(resultUnknown) && Array.isArray(resultUnknown.details)) {
          const items = resultUnknown.details as unknown[];
          const mapped: Array<{ field: keyof ApplicationFormData; step: number; message: string }> = [];
          for (const it of items) {
            const obj = it as BackendValidationItem;
            const prop = obj?.property ?? '';
            const map = backendToFrontendField[prop];
            if (!map) continue;
            let msg = '';
            const cons = obj?.constraints;
            if (cons && typeof cons === 'object') {
              const firstKey = Object.keys(cons)[0];
              if (firstKey) msg = t(mapConstraintToMessageKey(firstKey), cons[firstKey]);
            }
            mapped.push({ field: map.field, step: map.step, message: msg || t('validation.errors') });
          }
          if (mapped.length > 0) {
            mapped.forEach(({ field, message }) => {
              setError(field as FieldPath<ApplicationFormData>, { type: 'server', message });
            });
            const first = mapped[0];
            setCurrentStep(first.step);
            setStepErrors((p) => ({ ...p, [first.step]: true }));
            toast({ title: t('validation.errors'), description: t('errors.validation'), variant: 'destructive' });
            return;
          }
        }

        const message =
          (isRecord(resultUnknown) && typeof resultUnknown.message === 'string'
            ? resultUnknown.message
            : response.statusText) || 'Submission failed';
        const details =
          isRecord(resultUnknown) && Array.isArray(resultUnknown.details)
            ? `\n- ${resultUnknown.details.join('\n- ')}`
            : '';
        toast({ title: t('errors.server'), description: `${message}${details}`, variant: 'destructive' });
      }
    } catch {
      toast({ title: t('errors.server'), description: t('errors.network'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <Step1GeneralInfo />;
      case 2: return <Step2ProfessionalDetails />;
      case 3: return <Step3Education />;
      case 4: return <Step4AdditionalInfo />;
      case 5: return <Step5Funding />;
      case 6: return <Step6Summary onEdit={handleEditFromSummary} />;
      default: return <Step1GeneralInfo />;
    }
  };

  const hasDraft = typeof window !== 'undefined' && localStorage.getItem(DRAFT_STORAGE_KEY);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {hasDraft && currentStep === 1 && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm font-medium text-primary mb-2">{t('navigation.resumeDraft')}</p>
            <Button
              variant="outline" size="sm"
              onClick={() => methods.reset(JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY) || '{}'))}
            >
              {t('navigation.resumeDraft')}
            </Button>
          </div>
        )}

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-8">
            <Stepper currentStep={currentStep} totalSteps={totalSteps} errors={stepErrors} completedSteps={completedSteps} />

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mt-8">{renderCurrentStep()}</div>

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    {t('navigation.previous')}
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={handleNext}>{t('navigation.next')}</Button>
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
