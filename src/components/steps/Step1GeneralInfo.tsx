import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import type { ApplicationFormData } from '@/schemas/applicationSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/SearchableSelect';
import { getCountriesWithPriority, getNationalitiesWithPriority } from '@/data/countries';

type EmailExistsResponse = {
  exists: boolean;
  last?: {
    id?: number;
    uuid?: string;
    date_soumission?: string;
    date?: string;
    dateSoumission?: string;
  };
};

type EmailCheck =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'free' }
  | { status: 'exists'; last?: { id?: number; uuid?: string; date?: string } }
  | { status: 'error'; message?: string };

type WithMessage = { message?: string };

const API_BASE = 'https://gpe-yale.edocsflow.com/api';

export function Step1GeneralInfo() {
  const { t, i18n } = useTranslation();
  const { register, setValue, watch, formState: { errors } } = useFormContext<ApplicationFormData>();
  const values = watch();

  const [emailCheck, setEmailCheck] = useState<EmailCheck>({ status: 'idle' });

  useEffect(() => {
    const raw = (values?.email || '').trim();
    if (!raw) {
      setEmailCheck({ status: 'idle' });
      return;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(raw)) {
      setEmailCheck({ status: 'idle' });
      return;
    }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setEmailCheck({ status: 'checking' });
        const res = await fetch(`${API_BASE}/candidatures/exists?email=${encodeURIComponent(raw)}`, {
          signal: ctrl.signal, credentials: 'include'
        });
        if (!res.ok) {
          setEmailCheck({ status: 'error', message: res.statusText });
          return;
        }
        const data = (await res.json()) as EmailExistsResponse;
        if (data?.exists) {
          const last = data.last;
          setEmailCheck({
            status: 'exists',
            last: { id: last?.id, uuid: last?.uuid, date: pickDate(last) }
          });
        } else {
          setEmailCheck({ status: 'free' });
        }
      } catch (e) {
        if ((e as { name?: string })?.name !== 'AbortError') {
          setEmailCheck({ status: 'error', message: (e as Error).message });
        }
      }
    }, 400);

    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [values?.email]);

  const locale = i18n.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
  const countries = getCountriesWithPriority(locale);
  const nationalities = getNationalitiesWithPriority(locale);

  const countryOptions = [
    ...countries.priority,
    ...countries.others,
  ];
  const nationalityOptions = [
    ...nationalities.priority,
    ...nationalities.others,
  ];
  const separators = {
    [countries.priority[0]?.value ?? '']: t('countries.separator.priority'),
    [countries.others[0]?.value ?? '']: t('countries.separator.others'),
  };
  const sexOptions = [
    { value: 'Homme', label: t('options.sexe.Homme') },
    { value: 'Femme', label: t('options.sexe.Femme') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('stepper.step1')}</h2>
        <p className="text-muted-foreground">Veuillez remplir vos informations personnelles de base.</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm font-medium text-destructive mb-2">{t('validation.errors')}</p>
          <ul className="text-sm text-destructive space-y-1">
            {Object.entries(errors).map(([field, err]) => {
              const msg = (err as unknown as WithMessage)?.message ?? 'validation.required';
              return <li key={field}>• {t(msg)}</li>;
            })}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* nom */}
        <div className="space-y-2">
          <Label htmlFor="nom">{t('fields.nom')}</Label>
          <Input id="nom" {...register('nom')} placeholder={t('fields.nom')} className={errors.nom ? 'border-destructive' : ''} />
          {errors.nom && <p className="text-sm text-destructive">{t((errors.nom as WithMessage).message ?? '')}</p>}
        </div>

        {/* prenom */}
        <div className="space-y-2">
          <Label htmlFor="prenom">{t('fields.prenom')}</Label>
          <Input id="prenom" {...register('prenom')} placeholder={t('fields.prenom')} className={errors.prenom ? 'border-destructive' : ''} />
          {errors.prenom && <p className="text-sm text-destructive">{t((errors.prenom as WithMessage).message ?? '')}</p>}
        </div>

        {/* nationalite */}
        <div className="space-y-2">
          <Label htmlFor="nationalite">{t('fields.nationalite')}</Label>
          <SearchableSelect
            options={nationalityOptions}
            value={values.nationalite}
            onValueChange={(value) => setValue('nationalite', value)}
            placeholder={t('fields.nationalite')}
            searchPlaceholder={t('placeholders.searchNationality')}
            emptyMessage={t('validation.noNationalityFound')}
            groupSeparators={separators}
            className={errors.nationalite ? 'border-destructive' : ''}
          />
          {errors.nationalite && <p className="text-sm text-destructive">{t((errors.nationalite as WithMessage).message ?? '')}</p>}
        </div>

        {/* sexe */}
        <div className="space-y-2">
          <Label htmlFor="sexe">{t('fields.sexe')}</Label>
          <SearchableSelect
            options={sexOptions}
            value={values.sexe}
            onValueChange={(value) => setValue('sexe', value as ApplicationFormData['sexe'])}
            placeholder={t('fields.sexe')}
            searchPlaceholder={t('placeholders.search')}
            emptyMessage={t('validation.noResults')}
            className={errors.sexe ? 'border-destructive' : ''}
          />
          {errors.sexe && <p className="text-sm text-destructive">{t((errors.sexe as WithMessage).message ?? '')}</p>}
        </div>

        {/* dateNaissance */}
        <div className="space-y-2">
          <Label htmlFor="dateNaissance">{t('fields.dateNaissance')}</Label>
          <Input id="dateNaissance" type="date" {...register('dateNaissance')} className={errors.dateNaissance ? 'border-destructive' : ''} />
          {errors.dateNaissance && <p className="text-sm text-destructive">{t((errors.dateNaissance as WithMessage).message ?? '')}</p>}
        </div>

        {/* lieuNaissance */}
        <div className="space-y-2">
          <Label htmlFor="lieuNaissance">{t('fields.lieuNaissance')}</Label>
          <Input
            id="lieuNaissance"
            {...register('lieuNaissance')}
            placeholder={t('placeholders.lieuNaissance')}
            className={errors.lieuNaissance ? 'border-destructive' : ''}
          />
          {errors.lieuNaissance && <p className="text-sm text-destructive">{t((errors.lieuNaissance as WithMessage).message ?? '')}</p>}
        </div>

        {/* telephone */}
        <div className="space-y-2">
          <Label htmlFor="telephone">{t('fields.telephone')}</Label>
          <Input id="telephone" type="tel" {...register('telephone')} placeholder="+237 699 00 00 00" className={errors.telephone ? 'border-destructive' : ''} />
          {errors.telephone && <p className="text-sm text-destructive">{t((errors.telephone as WithMessage).message ?? '')}</p>}
        </div>

        {/* email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t('fields.email')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="exemple@email.com"
            className={errors.email ? 'border-destructive' : ''}
            aria-invalid={!!errors.email || emailCheck.status === 'exists'}
            aria-describedby="email-help"
          />
          {errors.email && <p className="text-sm text-destructive">{t((errors.email as WithMessage).message ?? '')}</p>}

          {!errors.email && emailCheck.status === 'exists' && (
            <div id="email-help" className="mt-1 text-sm text-destructive" role="alert">
              {t('errors.emailAlreadyUsed', 'Une candidature avec cet email existe déjà.')}
              {emailCheck.last?.date && (
                <span className="block text-xs text-muted-foreground">
                  {t('labels.lastSubmission', 'Dernière soumission')}: {new Date(emailCheck.last.date).toLocaleString()}
                </span>
              )}
            </div>
          )}
          {emailCheck.status === 'checking' && (
            <p className="text-xs text-muted-foreground">{t('labels.checking', 'Vérification…')}</p>
          )}
        </div>

        {/* organisation */}
        <div className="space-y-2">
          <Label htmlFor="organisation">{t('fields.organisation')}</Label>
          <Input id="organisation" {...register('organisation')} placeholder={t('fields.organisation')} className={errors.organisation ? 'border-destructive' : ''} />
          {errors.organisation && <p className="text-sm text-destructive">{t((errors.organisation as WithMessage).message ?? '')}</p>}
        </div>

        {/* pays */}
        <div className="space-y-2">
          <Label htmlFor="pays">{t('fields.pays')}</Label>
          <SearchableSelect
            options={countryOptions}
            value={values.pays}
            onValueChange={(value) => setValue('pays', value)}
            placeholder={t('fields.pays')}
            searchPlaceholder={t('placeholders.searchCountry')}
            emptyMessage={t('validation.noCountryFound')}
            groupSeparators={separators}
            className={errors.pays ? 'border-destructive' : ''}
          />
          {errors.pays && <p className="text-sm text-destructive">{t((errors.pays as WithMessage).message ?? '')}</p>}
        </div>
      </div>
    </div>
  );
}

const pickDate = (o?: EmailExistsResponse['last']): string | undefined =>
  o?.date_soumission ?? o?.date ?? o?.dateSoumission;