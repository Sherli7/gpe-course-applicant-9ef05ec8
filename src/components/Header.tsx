import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="https://gpe-yale.edocsflow.com/logo.png" 
            alt="GPE-Yale" 
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold text-foreground">
              {t('header.title')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {t('header.language')}:
          </span>
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">FR</SelectItem>
              <SelectItem value="en">EN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}