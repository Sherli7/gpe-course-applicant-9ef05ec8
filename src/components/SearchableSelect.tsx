import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string; // Nouvelle prop pour personnaliser le message de recherche vide
  className?: string;
  disabled?: boolean;
  groupSeparators?: { [key: string]: string };
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les marques diacritiques
    .toLowerCase();
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  className,
  disabled = false,
  groupSeparators,
}: SearchableSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    const normalizedQuery = normalizeString(searchQuery);
    return options.filter(option =>
      normalizeString(option.label).includes(normalizedQuery)
    );
  }, [options, searchQuery]);

  const selectedOption = options.find(option => option.value === value);

  const renderOptions = () => {
    if (groupSeparators) {
      const groups: { separator?: string; options: Option[] }[] = [];
      let currentGroup: Option[] = [];

      options.forEach(option => {
        const separator = groupSeparators[option.value];
        if (separator) {
          if (currentGroup.length > 0) {
            groups.push({ options: currentGroup });
            currentGroup = [];
          }
          groups.push({ separator, options: [option] });
        } else {
          currentGroup.push(option);
        }
      });

      if (currentGroup.length > 0) {
        groups.push({ options: currentGroup });
      }

      // Filtrer les groupes pour inclure uniquement ceux avec des options filtrées
      return groups.map((group, index) => {
        const groupOptions = group.options.filter(opt => filteredOptions.includes(opt));
        if (groupOptions.length === 0) return null;
        return (
          <div key={index}>
            {group.separator && (
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-t">
                {group.separator}
              </div>
            )}
            <CommandGroup>
              {groupOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        );
      }).filter(Boolean);
    }

    return (
      <CommandGroup>
        {filteredOptions.map((option) => (
          <CommandItem
            key={option.value}
            onSelect={() => {
              onValueChange(option.value);
              setOpen(false);
              setSearchQuery('');
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === option.value ? "opacity-100" : "opacity-0"
              )}
            />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-12", className)}
          disabled={disabled}
        >
          {selectedOption?.label || placeholder || t('placeholders.selectOption')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder || t('placeholders.search')}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {emptyMessage || t('validation.noResults')}
          </CommandEmpty>
          <div className="max-h-60 overflow-auto">
            {renderOptions()}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}