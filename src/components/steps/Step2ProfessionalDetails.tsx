import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, type FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicationFormData } from '@/schemas/applicationSchema';

export function Step2ProfessionalDetails() {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>();
  const errorEntries = Object.entries(errors) as Array<[string, FieldError]>;

  // Refs pour focus automatique
  const refDepartement = useRef<HTMLInputElement>(null);
  const refPosteActuel = useRef<HTMLInputElement>(null);
  const refDescriptionTaches = useRef<HTMLTextAreaElement>(null);

  // Focus automatique sur le premier champ en erreur
  useEffect(() => {
    if (errorEntries.length > 0) {
      const firstErrorField = errorEntries[0][0];
      const refMap: Record<string, React.RefObject<any>> = {
        departement: refDepartement,
        posteActuel: refPosteActuel,
        descriptionTaches: refDescriptionTaches,
      };
      const fieldRef = refMap[firstErrorField];
      if (fieldRef?.current) {
        setTimeout(() => {
          fieldRef.current?.focus();
          fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [errorEntries]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('stepper.step2')}</h2>
        <p className="text-muted-foreground">Parlez-nous de votre expérience professionnelle actuelle.</p>
      </div>

      {errorEntries.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm font-medium text-destructive mb-2">{t('validation.errors')}</p>
          <ul className="text-sm text-destructive space-y-1">
            {errorEntries.map(([field, err]) => (
              <li key={field}>• {t(err.message ?? 'validation.required')}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="departement">{t('fields.departement')}</Label>
          <Input id="departement" ref={refDepartement} {...register('departement')}
                 placeholder={t('fields.departement')}
                 className={errors.departement ? 'border-destructive' : ''} />
          {errors.departement?.message && <p className="text-sm text-destructive">{t(errors.departement.message)}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="posteActuel">{t('fields.posteActuel')}</Label>
          <Input id="posteActuel" ref={refPosteActuel} {...register('posteActuel')}
                 placeholder={t('fields.posteActuel')}
                 className={errors.posteActuel ? 'border-destructive' : ''} />
          {errors.posteActuel?.message && <p className="text-sm text-destructive">{t(errors.posteActuel.message)}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionTaches">{t('fields.descriptionTaches')}</Label>
        <Textarea id="descriptionTaches" ref={refDescriptionTaches} {...register('descriptionTaches')}
                  placeholder={t('placeholders.enterText')} rows={4}
                  className={errors.descriptionTaches ? 'border-destructive' : ''} />
        {errors.descriptionTaches?.message && (
          <p className="text-sm text-destructive">{t(errors.descriptionTaches.message)}</p>
        )}
      </div>
    </div>
  );
}
