import { useTranslation } from 'react-i18next';
import { useFormContext, type FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';
import type { ApplicationFormData } from '@/schemas/applicationSchema';

const LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Natif'] as const;
type Level = typeof LEVELS[number];
type LanguageLevels = Record<string, Level>;

const DEFAULT_LEVEL: Level = 'Intermédiaire';
const isLevel = (x: string): x is Level => (LEVELS as readonly string[]).includes(x);

/** Normalise toute entrée en Level strict (et mappe "Courant" -> "Avancé") */
const normalizeLevel = (level: string): Level =>
  level === 'Courant' ? 'Avancé' : isLevel(level) ? level : DEFAULT_LEVEL;

export function Step3Education() {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplicationFormData>();

  const values = watch();
  const selectedLanguages: string[] = values.langues ?? [];
  const languageLevels: LanguageLevels = (values.niveaux ?? {}) as LanguageLevels;

  const diplomeOptions = [
    { value: 'Baccalauréat', label: t('options.diplomes.Baccalauréat') },
    { value: 'BTS/DUT', label: t('options.diplomes.BTS/DUT') },
    { value: 'Licence', label: t('options.diplomes.Licence') },
    { value: 'Master/MBA', label: t('options.diplomes.Master/MBA') },
    { value: 'Doctorat', label: t('options.diplomes.Doctorat') },
  ];

  const languageOptions = [
    { value: 'Français', label: t('options.langues.Français') },
    { value: 'Anglais', label: t('options.langues.Anglais') },
  ];

  const levelOptions = LEVELS.map((lv) => ({ value: lv, label: t(`options.niveaux.${lv}`) }));
  const errorEntries = Object.entries(errors) as Array<[string, FieldError]>;

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      const newLanguages = Array.from(new Set([...selectedLanguages, language]));
      setValue('langues', newLanguages, { shouldValidate: true });

      const current = languageLevels[language];
      const normalized = current ? normalizeLevel(current) : DEFAULT_LEVEL;
      const updated: LanguageLevels = { ...languageLevels, [language]: normalized };
      setValue('niveaux', updated, { shouldValidate: true });
    } else {
      const newLanguages = selectedLanguages.filter((l) => l !== language);
      const newLevels: LanguageLevels = { ...languageLevels };
      delete newLevels[language];
      setValue('langues', newLanguages, { shouldValidate: true });
      setValue('niveaux', newLevels, { shouldValidate: true });
    }
  };

  const handleLevelChange = (language: string, level: string) => {
    const normalized = normalizeLevel(level);
    const updated: LanguageLevels = { ...languageLevels, [language]: normalized };
    setValue('niveaux', updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('stepper.step3')}</h2>
        <p className="text-muted-foreground">
          Informations sur votre parcours éducatif et vos compétences linguistiques.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="diplome">{t('fields.diplome')}</Label>
          <SearchableSelect
            options={diplomeOptions}
            value={values.diplome}
            onValueChange={(v) => setValue('diplome', v, { shouldValidate: true })}
            placeholder={t('fields.diplome')}
            className={errors.diplome ? 'border-destructive' : ''}
          />
          {errors.diplome?.message && (
            <p className="text-sm text-destructive">{t(errors.diplome.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institutionFinancement">{t('fields.institutionFinancement')}</Label>
          <Input
            id="institutionFinancement"
            {...register('institutionFinancement')}
            placeholder={t('fields.institutionFinancement')}
            className={errors.institutionFinancement ? 'border-destructive' : ''}
          />
          {errors.institutionFinancement?.message && (
            <p className="text-sm text-destructive">{t(errors.institutionFinancement.message)}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="domaine">{t('fields.domaine')}</Label>
          <Input
            id="domaine"
            {...register('domaine')}
            placeholder={t('fields.domaine')}
            className={errors.domaine ? 'border-destructive' : ''}
          />
          {errors.domaine?.message && (
            <p className="text-sm text-destructive">{t(errors.domaine.message)}</p>
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
                      onValueChange={(v) => handleLevelChange(lang.value, v)}
                      placeholder={t('placeholders.selectOption')}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors.langues?.message && (
          <p className="text-sm text-destructive">{t(errors.langues.message)}</p>
        )}
        {errors.niveaux?.message && (
          <p className="text-sm text-destructive">
            {typeof errors.niveaux.message === 'string'
              ? t(errors.niveaux.message)
              : t('validation.required')}
          </p>
        )}
      </div>
    </div>
  );
}
