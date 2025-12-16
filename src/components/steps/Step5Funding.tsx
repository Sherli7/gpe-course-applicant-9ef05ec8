import { useTranslation } from 'react-i18next';
import { useFormContext, type FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';
import type { ApplicationFormData, Mode } from '@/schemas/applicationSchema';

export function Step5Funding() {
  const { t } = useTranslation();
  const { register, setValue, watch, formState: { errors } } =
    useFormContext<ApplicationFormData>();

  const values = watch();
  const fundingMethod = values.mode;
  const needsFundingDetails = fundingMethod !== 'Vous-même';
  const errorEntries = Object.entries(errors) as Array<[string, FieldError]>;

  const fundingOptions: Array<{ value: Mode; label: string }> = [
    { value: 'Vous-même', label: t('options.financement.Vous-même', 'Vous-même') },
    { value: 'Institution', label: t('options.financement.Institution', 'Institution') },
    { value: 'Autre', label: t('options.financement.Autre', 'Autre') },
  ];

  const sourceOptions = [
    { value: 'Site web',          label: t('options.sources.Site web', 'Site web') },
    { value: 'Réseaux sociaux',   label: t('options.sources.Réseaux sociaux', 'Réseaux sociaux') },
    { value: 'Bouche-à-oreille',  label: t('options.sources.Bouche-à-oreille', 'Bouche-à-oreille') },
    { value: 'Partenaire',        label: t('options.sources.Partenaire', 'Partenaire') },
    { value: 'Autre',             label: t('options.sources.Autre', 'Autre') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('stepper.step5')}</h2>
        <p className="text-muted-foreground">
          {t('help.financement', 'Informations sur le financement de votre formation.')}
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
        {/* Mode de financement */}
        <div className="space-y-4">
          <Label className="text-base font-medium">{t('fields.mode')}</Label>
          <RadioGroup
            value={fundingMethod}
            onValueChange={(v) => setValue('mode', v as Mode, { shouldValidate: true })}
          >
            {fundingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`funding-${option.value}`} />
                <Label htmlFor={`funding-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.mode?.message && (
            <p className="text-sm text-destructive">{t(errors.mode.message)}</p>
          )}
        </div>

        {/* Détails financement si ≠ Vous-même */}
        {needsFundingDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <Label htmlFor="institutionFinancement">
                {t('fields.institutionFinancement')} <span className="text-muted-foreground ml-1">({t('labels.requis', 'requis')})</span>
              </Label>
              <Input
                id="institutionFinancement"
                {...register('institutionFinancement')}
                placeholder={t('fields.institutionFinancement')}
                className={errors.institutionFinancement ? 'border-destructive' : ''}
                required
                aria-required="true"
              />
              {errors.institutionFinancement?.message && (
                <p className="text-sm text-destructive">{t(errors.institutionFinancement.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactFinancement">
                {t('fields.contactFinancement')} <span className="text-muted-foreground ml-1">({t('labels.requis', 'requis')})</span>
              </Label>
              <Input
                id="contactFinancement"
                {...register('contactFinancement')}
                placeholder={t('fields.contactFinancement')}
                className={errors.contactFinancement ? 'border-destructive' : ''}
                required
                aria-required="true"
              />
              {errors.contactFinancement?.message && (
                <p className="text-sm text-destructive">{t(errors.contactFinancement.message)}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emailContactFinancement">
                {t('fields.emailContactFinancement')} <span className="text-muted-foreground ml-1">({t('labels.requis', 'requis')})</span>
              </Label>
              <Input
                id="emailContactFinancement"
                type="email"
                {...register('emailContactFinancement')}
                placeholder="contact@organisation.com"
                className={errors.emailContactFinancement ? 'border-destructive' : ''}
                required
                aria-required="true"
              />
              {errors.emailContactFinancement?.message && (
                <p className="text-sm text-destructive">{t(errors.emailContactFinancement.message)}</p>
              )}
            </div>
          </div>
        )}

        {/* Source */}
        <div className="space-y-2">
          <Label htmlFor="source">{t('fields.source')}</Label>
          <SearchableSelect
            options={sourceOptions}
            value={values.source}
            onValueChange={(v) => setValue('source', v, { shouldValidate: true })}
            placeholder={t('fields.source')}
            className={errors.source ? 'border-destructive' : ''}
          />
          {errors.source?.message && (
            <p className="text-sm text-destructive">{t(errors.source.message)}</p>
          )}
        </div>

        {/* Consentement */}
        <div className="flex items-start space-x-2 p-4 border rounded-lg">
          <Checkbox
            id="consentement"
            checked={values.consentement}
            onCheckedChange={(checked) =>
              setValue('consentement', checked === true, { shouldValidate: true })
            }
          />
          <div className="space-y-1">
            <Label htmlFor="consentement" className="text-sm font-normal cursor-pointer">
              {t('fields.consentement')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('help.consentement', "En cochant cette case, vous acceptez que vos données personnelles soient traitées conformément à notre politique de confidentialité.")}
            </p>
          </div>
        </div>
        {errors.consentement?.message && (
          <p className="text-sm text-destructive">{t(errors.consentement.message)}</p>
        )}
      </div>
    </div>
  );
}
