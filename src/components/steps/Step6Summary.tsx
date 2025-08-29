import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface Step6SummaryProps {
  onEdit: (step: number) => void;
}

export function Step6Summary({ onEdit }: Step6SummaryProps) {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  
  const values = watch();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatLanguages = () => {
    const { langues = [], niveaux = {} } = values;
    return langues.map((lang: string) => 
      `${lang} (${niveaux[lang] || 'N/A'})`
    ).join(', ');
  };

  const sections = [
    {
      title: t('stepper.step1'),
      step: 1,
      fields: [
        { label: t('fields.nom'), value: values.nom },
        { label: t('fields.prenom'), value: values.prenom },
        { label: t('fields.nationalite'), value: values.nationalite },
        { label: t('fields.sexe'), value: values.sexe ? t(`options.sexe.${values.sexe}`) : '' },
        { label: t('fields.dateNaissance'), value: formatDate(values.dateNaissance) },
        { label: t('fields.lieuNaissance'), value: values.lieuNaissance },
        { label: t('fields.telephone'), value: values.telephone },
        { label: t('fields.email'), value: values.email },
        { label: t('fields.organisation'), value: values.organisation },
        { label: t('fields.pays'), value: values.pays }
      ]
    },
    {
      title: t('stepper.step2'),
      step: 2,
      fields: [
        { label: t('fields.departement'), value: values.departement },
        { label: t('fields.posteActuel'), value: values.posteActuel },
        { label: t('fields.descriptionTaches'), value: values.descriptionTaches }
      ]
    },
    {
      title: t('stepper.step3'),
      step: 3,
      fields: [
        { label: t('fields.diplome'), value: values.diplome ? t(`options.diplomes.${values.diplome}`) : '' },
        { label: t('fields.institution'), value: values.institution },
        { label: t('fields.domaine'), value: values.domaine },
        { label: t('fields.langues'), value: formatLanguages() }
      ]
    },
    {
      title: t('stepper.step4'),
      step: 4,
      fields: [
        { label: t('fields.resultatsAttendus'), value: values.resultatsAttendus },
        { label: t('fields.autresInfos'), value: values.autresInfos || 'N/A' }
      ]
    },
    {
      title: t('stepper.step5'),
      step: 5,
      fields: [
        { 
          label: t('fields.modeFinancement'), 
          value: values.modeFinancement ? t(`options.financement.${values.modeFinancement}`) : ''
        },
        { label: t('fields.institutionFinancement'), value: values.institutionFinancement || 'N/A' },
        { label: t('fields.contactFinancement'), value: values.contactFinancement || 'N/A' },
        { label: t('fields.emailContactFinancement'), value: values.emailContactFinancement || 'N/A' },
        { 
          label: t('fields.source'), 
          value: values.source ? t(`options.sources.${values.source}`) : ''
        },
        { 
          label: t('fields.consentement'), 
          value: values.consentement ? 'Oui' : 'Non'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('stepper.step6')}
        </h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations avant de soumettre votre candidature.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.step} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(section.step)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('navigation.edit')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.label} className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="text-sm text-foreground">
                      {field.value || 'N/A'}
                    </dd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm font-medium text-primary mb-2">
          ⚠️ Attention
        </p>
        <p className="text-sm text-muted-foreground">
          Veuillez vérifier attentivement toutes vos informations avant de soumettre votre candidature. 
          Une fois soumise, vous ne pourrez plus la modifier.
        </p>
      </div>
    </div>
  );
}