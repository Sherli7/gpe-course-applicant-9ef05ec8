import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ConfirmationPageProps {
  onNewApplication: () => void;
  reference?: string;
}

export function ConfirmationPage({ onNewApplication, reference }: ConfirmationPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {t('confirmation.title')}
          </h2>
          
          <p className="text-muted-foreground mb-6">
            {t('confirmation.message')}
          </p>
          
          {reference && (
            <p className="text-sm font-mono text-muted-foreground mb-6 bg-muted p-3 rounded">
              {t('confirmation.reference', { id: reference })}
            </p>
          )}
          
          <Button onClick={onNewApplication} className="w-full">
            {t('navigation.newApplication')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}