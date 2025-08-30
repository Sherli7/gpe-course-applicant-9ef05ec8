import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { getCountriesWithPriority } from '@/data/countries';

export function Step1GeneralInfo() {
  const { t } = useTranslation();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const values = watch();
  const countries = getCountriesWithPriority();
  
  const countryOptions = [
    ...countries.priority.map(country => ({
      value: country,
      label: country
    })),
    ...countries.others.map(country => ({
      value: country,
      label: country
    }))
  ];

  const separators = {
    [countries.priority[0]]: t('countries.separator.priority'),
    [countries.others[0]]: t('countries.separator.others')
  };

  const sexOptions = [
    { value: 'Homme', label: t('options.sexe.Homme') },
    { value: 'Femme', label: t('options.sexe.Femme') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step1')}
        </h2>
        <p className="text-muted-foreground">
          Veuillez remplir vos informations personnelles de base.
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
          <Label htmlFor="nom">{t('fields.nom')}</Label>
          <Input
            id="nom"
            {...register('nom')}
            placeholder={t('fields.nom')}
            className={errors.nom ? 'border-destructive' : ''}
          />
          {errors.nom && (
            <p className="text-sm text-destructive">
              {t(errors.nom?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prenom">{t('fields.prenom')}</Label>
          <Input
            id="prenom"
            {...register('prenom')}
            placeholder={t('fields.prenom')}
            className={errors.prenom ? 'border-destructive' : ''}
          />
          {errors.prenom && (
            <p className="text-sm text-destructive">
              {t(errors.prenom?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalite">{t('fields.nationalite')}</Label>
          <SearchableSelect
            options={countryOptions}
            value={values.nationalite}
            onValueChange={(value) => setValue('nationalite', value)}
            placeholder={t('fields.nationalite')}
            searchPlaceholder={t('placeholders.searchCountry')}
            groupSeparators={separators}
            className={errors.nationalite ? 'border-destructive' : ''}
          />
          {errors.nationalite && (
            <p className="text-sm text-destructive">
              {t(errors.nationalite?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexe">{t('fields.sexe')}</Label>
          <SearchableSelect
            options={sexOptions}
            value={values.sexe}
            onValueChange={(value) => setValue('sexe', value)}
            placeholder={t('fields.sexe')}
            className={errors.sexe ? 'border-destructive' : ''}
          />
          {errors.sexe && (
            <p className="text-sm text-destructive">
              {t(errors.sexe?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateNaissance">{t('fields.dateNaissance')}</Label>
          <Input
            id="dateNaissance"
            type="date"
            {...register('dateNaissance')}
            className={errors.dateNaissance ? 'border-destructive' : ''}
          />
          {errors.dateNaissance && (
            <p className="text-sm text-destructive">
              {t(errors.dateNaissance?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lieuNaissance">{t('fields.lieuNaissance')}</Label>
          <SearchableSelect
            options={countryOptions}
            value={values.lieuNaissance}
            onValueChange={(value) => setValue('lieuNaissance', value)}
            placeholder={t('fields.lieuNaissance')}
            searchPlaceholder={t('placeholders.searchCountry')}
            groupSeparators={separators}
            className={errors.lieuNaissance ? 'border-destructive' : ''}
          />
          {errors.lieuNaissance && (
            <p className="text-sm text-destructive">
              {t(errors.lieuNaissance?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telephone">{t('fields.telephone')}</Label>
          <Input
            id="telephone"
            type="tel"
            {...register('telephone')}
            placeholder="+237 699 00 00 00"
            className={errors.telephone ? 'border-destructive' : ''}
          />
          {errors.telephone && (
            <p className="text-sm text-destructive">
              {t(errors.telephone?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('fields.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="exemple@email.com"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive">
              {t(errors.email?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organisation">{t('fields.organisation')}</Label>
          <Input
            id="organisation"
            {...register('organisation')}
            placeholder={t('fields.organisation')}
            className={errors.organisation ? 'border-destructive' : ''}
          />
          {errors.organisation && (
            <p className="text-sm text-destructive">
              {t(errors.organisation?.message as string)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pays">{t('fields.pays')}</Label>
          <SearchableSelect
            options={countryOptions}
            value={values.pays}
            onValueChange={(value) => setValue('pays', value)}
            placeholder={t('fields.pays')}
            searchPlaceholder={t('placeholders.searchCountry')}
            groupSeparators={separators}
            className={errors.pays ? 'border-destructive' : ''}
          />
          {errors.pays && (
            <p className="text-sm text-destructive">
              {t(errors.pays?.message as string)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}