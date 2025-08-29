import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Step4AdditionalInfo() {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step4')}
        </h2>
        <p className="text-muted-foreground">
          Partagez vos objectifs et toute information complémentaire pertinente.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm font-medium text-destructive mb-2">
            {t('validation.errors')}
          </p>
          <ul className="text-sm text-destructive space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {t(error?.message as string || 'validation.required')}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resultatsAttendus">{t('fields.resultatsAttendus')}</Label>
          <Textarea
            id="resultatsAttendus"
            {...register('resultatsAttendus')}
            placeholder={t('placeholders.enterText')}
            rows={4}
            className={errors.resultatsAttendus ? 'border-destructive' : ''}
          />
          {errors.resultatsAttendus && (
            <p className="text-sm text-destructive">
              {t(errors.resultatsAttendus?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="autresInfos">
            {t('fields.autresInfos')} 
            <span className="text-muted-foreground ml-1">(optionnel)</span>
          </Label>
          <Textarea
            id="autresInfos"
            {...register('autresInfos')}
            placeholder={t('placeholders.enterText')}
            rows={4}
            className={errors.autresInfos ? 'border-destructive' : ''}
          />
          {errors.autresInfos && (
            <p className="text-sm text-destructive">
              {t(errors.autresInfos?.message as string)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}