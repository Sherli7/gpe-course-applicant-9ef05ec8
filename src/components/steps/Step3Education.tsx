import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';

type FieldErrorLike = { message?: string };
const hasMessage = (e: unknown): e is FieldErrorLike =>
  typeof e === 'object' && e !== null && typeof (e as FieldErrorLike).message === 'string';

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'] as const;
type Level = typeof LEVELS[number];
const DEFAULT_LEVEL: Level = 'Intermédiaire';
const isLevel = (x: string): x is Level => LEVELS.includes(x as Level);

const normalizeLevel = (level: string): Level => {
  if (level === 'Courant') return 'Avancé'; // compat ancienne valeur
  return isLevel(level) ? level : DEFAULT_LEVEL;
};

export function Step3Education() {
  const { t } = useTranslation();
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  const values = watch();
  const selectedLanguages: string[] = values.languages || [];
  const languageLevels: Record<string, string> = values.languageLevels || {};

  const diplomeOptions = [
    { value: 'Baccalauréat', label: t('options.diplomes.Baccalauréat') },
    { value: 'BTS/DUT', label: t('options.diplomes.BTS/DUT') },
    { value: 'Licence', label: t('options.diplomes.Licence') },
    { value: 'Master/MBA', label: t('options.diplomes.Master/MBA') },
    { value: 'Doctorat', label: t('options.diplomes.Doctorat') }
  ];

  const languageOptions = [
    { value: 'Français', label: t('options.langues.Français') },
    { value: 'Anglais', label: t('options.langues.Anglais') },
  ];

  // sans "Courant" (non accepté par le backend)
  const levelOptions = [
    { value: 'Débutant',      label: t('options.niveaux.Débutant') },
    { value: 'Intermédiaire', label: t('options.niveaux.Intermédiaire') },
    { value: 'Avancé',        label: t('options.niveaux.Avancé') },
    { value: 'Natif',         label: t('options.niveaux.Natif') }
  ];

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      const newLanguages = Array.from(new Set([...selectedLanguages, language]));
      setValue('languages', newLanguages, { shouldValidate: true });

      const current = languageLevels[language];
      const normalized = current ? normalizeLevel(current) : DEFAULT_LEVEL;
      setValue('languageLevels', { ...languageLevels, [language]: normalized }, { shouldValidate: true });
    } else {
      const newLanguages = selectedLanguages.filter((l) => l !== language);
      const newLevels = { ...languageLevels };
      delete newLevels[language];
      setValue('languages', newLanguages, { shouldValidate: true });
      setValue('languageLevels', newLevels, { shouldValidate: true });
    }
  };

  const handleLevelChange = (language: string, level: string) => {
    const normalized = normalizeLevel(level);
    setValue('languageLevels', { ...languageLevels, [language]: normalized }, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step3')}
        </h2>
        <p className="text-muted-foreground">
          Informations sur votre parcours éducatif et vos compétences linguistiques.
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm font-medium text-destructive mb-2">
            {t('validation.errors')}
          </p>
          <ul className="text-sm text-destructive space-y-1">
            {Object.entries(errors).map(([field, err]) => {
              const msg = hasMessage(err) ? err.message : 'validation.required';
              return <li key={field}>• {t(msg)}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="diploma">{t('fields.diplome')}</Label>
          <SearchableSelect
            options={diplomeOptions}
            value={values.diploma}
            onValueChange={(value) => setValue('diploma', value, { shouldValidate: true })}
            placeholder={t('fields.diplome')}
            className={errors.diploma ? 'border-destructive' : ''}
          />
          {errors.diploma && (
            <p className="text-sm text-destructive">
              {t(hasMessage(errors.diploma) ? errors.diploma.message! : 'validation.required')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">{t('fields.institution')}</Label>
          <Input
            id="institution"
            {...register('institution')}
            placeholder={t('fields.institution')}
            className={errors.institution ? 'border-destructive' : ''}
          />
          {errors.institution && (
            <p className="text-sm text-destructive">
              {t(hasMessage(errors.institution) ? errors.institution.message! : 'validation.required')}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="field">{t('fields.domaine')}</Label>
          <Input
            id="field"
            {...register('field')}
            placeholder={t('fields.domaine')}
            className={errors.field ? 'border-destructive' : ''}
          />
          {errors.field && (
            <p className="text-sm text-destructive">
              {t(hasMessage(errors.field) ? errors.field.message! : 'validation.required')}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">{t('fields.langues')}</Label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languageOptions.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.value);
            return (
              <div key={lang.value} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${lang.value}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleLanguageChange(lang.value, checked === true)
                    }
                  />
                  <Label htmlFor={`language-${lang.value}`} className="font-medium">
                    {lang.label}
                  </Label>
                </div>

                {isSelected && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      {t('fields.niveaux')}
                    </Label>
                    <SearchableSelect
                      options={levelOptions}
                      value={normalizeLevel(languageLevels[lang.value] || DEFAULT_LEVEL)}
                      onValueChange={(value) => handleLevelChange(lang.value, value)}
                      placeholder={t('placeholders.selectOption')}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors.languages && (
          <p className="text-sm text-destructive">
            {t(hasMessage(errors.languages) ? errors.languages.message! : 'validation.required')}
          </p>
        )}
        {errors.languageLevels && (
          <p className="text-sm text-destructive">
            {t(hasMessage(errors.languageLevels) ? errors.languageLevels.message! : 'validation.required')}
          </p>
        )}
      </div>
    </div>
  );
}
