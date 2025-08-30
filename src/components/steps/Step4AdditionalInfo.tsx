import { useTranslation } from 'react-i18next';
import { useFormContext, type FieldError } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicationFormData } from '@/schemas/applicationSchema';

export function Step4AdditionalInfo() {
  const { t } = useTranslation();
  const { register, formState: { errors } } =
    useFormContext<ApplicationFormData>();

  const errorEntries = Object.entries(errors) as Array<[string, FieldError]>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('stepper.step4')}</h2>
        <p className="text-muted-foreground">
          {t('stepper.step4Desc', 'Partagez vos objectifs et toute information complémentaire pertinente.')}
        </p>
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

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resultatsAttendus">{t('fields.resultatsAttendus')}</Label>
          <Label htmlFor="resultatsAttendus">{t('fields.resultatsAttendus')}</Label>
          <Textarea
            id="resultatsAttendus"
            {...register('resultatsAttendus')}
            id="resultatsAttendus"
            {...register('resultatsAttendus')}
            placeholder={t('placeholders.enterText')}
            rows={4}
            aria-invalid={!!errors.resultatsAttendus}
            className={errors.resultatsAttendus ? 'border-destructive' : undefined}
          />
          {errors.resultatsAttendus?.message && (
            <p className="text-sm text-destructive">{t(errors.resultatsAttendus.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="autresInfos">
            {t('fields.autresInfos')} <span className="text-muted-foreground ml-1">(optionnel)</span>
          </Label>
          <Textarea
            id="autresInfos"
            {...register('autresInfos')}
            id="autresInfos"
            {...register('autresInfos')}
            placeholder={t('placeholders.enterText')}
            rows={4}
            aria-invalid={!!errors.autresInfos}
            className={errors.autresInfos ? 'border-destructive' : undefined}
          />
          {errors.autresInfos?.message && (
            <p className="text-sm text-destructive">{t(errors.autresInfos.message)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
