import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Checkbox } from '@/components/ui/checkbox';

export function Step3Education() {
  const { t } = useTranslation();
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  
  const values = watch();
  const selectedLanguages = values.languages || [];
  const languageLevels = values.languageLevels || {};

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
    { value: 'Espagnol', label: t('options.langues.Espagnol') },
    { value: 'Portugais', label: t('options.langues.Portugais') },
    { value: 'Arabe', label: t('options.langues.Arabe') },
    { value: 'Chinois', label: t('options.langues.Chinois') }
  ];

  const levelOptions = [
    { value: 'Débutant', label: t('options.niveaux.Débutant') },
    { value: 'Intermédiaire', label: t('options.niveaux.Intermédiaire') },
    { value: 'Avancé', label: t('options.niveaux.Avancé') },
    { value: 'Courant', label: t('options.niveaux.Courant') },
    { value: 'Natif', label: t('options.niveaux.Natif') }
  ];

  const handleLanguageChange = (language: string, checked: boolean) => {
    let newLanguages;
    if (checked) {
      newLanguages = [...selectedLanguages, language];
    } else {
      newLanguages = selectedLanguages.filter((lang: string) => lang !== language);
      // Remove level for unchecked language
      const newLevels = { ...languageLevels };
      delete newLevels[language];
      setValue('languageLevels', newLevels);
    }
    setValue('languages', newLanguages);
  };

  const handleLevelChange = (language: string, level: string) => {
    setValue('languageLevels', {
      ...languageLevels,
      [language]: level
    });
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
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {t(error?.message as string || 'validation.required')}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="diploma">{t('fields.diplome')}</Label>
          <SearchableSelect
            options={diplomeOptions}
            value={values.diploma}
            onValueChange={(value) => setValue('diploma', value)}
            placeholder={t('fields.diplome')}
            className={errors.diploma ? 'border-destructive' : ''}
          />
          {errors.diploma && (
            <p className="text-sm text-destructive">
              {t(errors.diploma?.message as string)}
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
              {t(errors.institution?.message as string)}
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
              {t(errors.field?.message as string)}
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
                      handleLanguageChange(lang.value, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`language-${lang.value}`}
                    className="font-medium"
                  >
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
                      value={languageLevels[lang.value] || ''}
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
            {t(errors.languages?.message as string)}
          </p>
        )}
        {errors.languageLevels && (
          <p className="text-sm text-destructive">
            {t(errors.languageLevels?.message as string)}
          </p>
        )}
      </div>
    </div>
  );
}