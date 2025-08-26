import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function Step2ProfessionalDetails() {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step2')}
        </h2>
        <p className="text-muted-foreground">
          Parlez-nous de votre expérience professionnelle actuelle.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="departement">{t('fields.departement')}</Label>
          <Input
            id="departement"
            {...register('departement')}
            placeholder={t('fields.departement')}
            className={errors.departement ? 'border-destructive' : ''}
          />
          {errors.departement && (
            <p className="text-sm text-destructive">
              {t(errors.departement?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="poste_actuel">{t('fields.poste_actuel')}</Label>
          <Input
            id="poste_actuel"
            {...register('poste_actuel')}
            placeholder={t('fields.poste_actuel')}
            className={errors.poste_actuel ? 'border-destructive' : ''}
          />
          {errors.poste_actuel && (
            <p className="text-sm text-destructive">
              {t(errors.poste_actuel?.message as string)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_taches">{t('fields.description_taches')}</Label>
        <Textarea
          id="description_taches"
          {...register('description_taches')}
          placeholder={t('placeholders.enterText')}
          rows={4}
          className={errors.description_taches ? 'border-destructive' : ''}
        />
        {errors.description_taches && (
          <p className="text-sm text-destructive">
            {t(errors.description_taches?.message as string)}
          </p>
        )}
      </div>
    </div>
  );
}