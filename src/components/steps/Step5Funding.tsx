import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';

export function Step5Funding() {
  const { t } = useTranslation();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const values = watch();
  const fundingMethod = values.fundingMode;
  const needsFundingDetails = fundingMethod && fundingMethod !== 'Vous-même';

  const fundingOptions = [
    { value: 'Vous-même', label: t('options.financement.Vous-même') },
    { value: 'Employeur', label: t('options.financement.Employeur') },
    { value: 'Bourse', label: t('options.financement.Bourse') },
    { value: 'Organisme public', label: t('options.financement.Organisme public') },
    { value: 'Autre', label: t('options.financement.Autre') }
  ];

  const sourceOptions = [
    { value: 'Site web', label: t('options.sources.Site web') },
    { value: 'Réseaux sociaux', label: t('options.sources.Réseaux sociaux') },
    { value: 'Bouche-à-oreille', label: t('options.sources.Bouche-à-oreille') },
    { value: 'Partenaire', label: t('options.sources.Partenaire') },
    { value: 'Autre', label: t('options.sources.Autre') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step5')}
        </h2>
        <p className="text-muted-foreground">
          Informations sur le financement de votre formation.
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
        <div className="space-y-4">
          <Label className="text-base font-medium">{t('fields.mode_financement')}</Label>
          <RadioGroup 
            value={fundingMethod} 
            onValueChange={(value) => setValue('fundingMode', value)}
          >
            {fundingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`funding-${option.value}`} />
                <Label htmlFor={`funding-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.fundingMode && (
            <p className="text-sm text-destructive">
              {t(errors.fundingMode?.message as string)}
            </p>
          )}
        </div>

        {needsFundingDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
            <div className="space-y-2">
              <Label htmlFor="fundingInstitution">
                {t('fields.institution_financement')}
                <span className="text-muted-foreground ml-1">(optionnel)</span>
              </Label>
              <Input
                id="fundingInstitution"
                {...register('fundingInstitution')}
                placeholder={t('fields.institution_financement')}
                className={errors.fundingInstitution ? 'border-destructive' : ''}
              />
              {errors.fundingInstitution && (
                <p className="text-sm text-destructive">
                  {t(errors.fundingInstitution?.message as string)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundingContact">
                {t('fields.contact_financement')}
                <span className="text-muted-foreground ml-1">(optionnel)</span>
              </Label>
              <Input
                id="fundingContact"
                {...register('fundingContact')}
                placeholder={t('fields.contact_financement')}
                className={errors.fundingContact ? 'border-destructive' : ''}
              />
              {errors.fundingContact && (
                <p className="text-sm text-destructive">
                  {t(errors.fundingContact?.message as string)}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fundingContactEmail">
                {t('fields.email_contact_financement')}
                <span className="text-muted-foreground ml-1">(optionnel)</span>
              </Label>
              <Input
                id="fundingContactEmail"
                type="email"
                {...register('fundingContactEmail')}
                placeholder="contact@organisation.com"
                className={errors.fundingContactEmail ? 'border-destructive' : ''}
              />
              {errors.fundingContactEmail && (
                <p className="text-sm text-destructive">
                  {t(errors.fundingContactEmail?.message as string)}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="informationSource">{t('fields.source_information')}</Label>
          <SearchableSelect
            options={sourceOptions}
            value={values.informationSource}
            onValueChange={(value) => setValue('informationSource', value)}
            placeholder={t('fields.source_information')}
            className={errors.informationSource ? 'border-destructive' : ''}
          />
          {errors.informationSource && (
            <p className="text-sm text-destructive">
              {t(errors.informationSource?.message as string)}
            </p>
          )}
        </div>

        <div className="flex items-start space-x-2 p-4 border rounded-lg">
          <Checkbox
            id="consent"
            checked={values.consent}
            onCheckedChange={(checked) => setValue('consent', checked)}
          />
          <div className="space-y-1">
            <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
              {t('fields.consentement')}
            </Label>
            <p className="text-xs text-muted-foreground">
              En cochant cette case, vous acceptez que vos données personnelles soient traitées 
              conformément à notre politique de confidentialité.
            </p>
          </div>
        </div>
        {errors.consent && (
          <p className="text-sm text-destructive">
            {t(errors.consent?.message as string)}
          </p>
        )}
      </div>
    </div>
  );
}