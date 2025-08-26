import { CheckIcon, ChevronsUpDownIcon, LanguagesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AVAILABLE_LANGUAGES, LanguageKey } from '@/lib/i18n/constants';
import { cn } from '@/lib/tailwind/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LocalSwitcher = (props: {
  iconOnly?: boolean;
  'data-testid'?: string;
}) => {
  const { i18n, t } = useTranslation(['common']);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={props.iconOnly ? 'ghost' : 'link'}
          size={props.iconOnly ? 'icon' : 'default'}
          data-testid={props['data-testid'] || 'local-switcher'}
        >
          <LanguagesIcon className="opacity-50" />
          <span className={cn(props.iconOnly && 'sr-only')}>
            {t(`common:languages.values.${i18n.language as LanguageKey}`)}
          </span>
          {!props.iconOnly && <ChevronsUpDownIcon className="opacity-50" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {AVAILABLE_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.key}
            data-testid={`language-option-${language.key}`}
            onClick={() => {
              i18n.changeLanguage(language.key);
            }}
          >
            <CheckIcon
              className={cn(
                'mt-0.5 size-4 self-start',
                i18n.language === language.key ? 'opacity-100' : 'opacity-0'
              )}
            />
            <span className="flex flex-col">
              <span>{t(`common:languages.values.${language.key}`)}</span>
              {language.key !== i18n.language && (
                <span className="text-xs text-muted-foreground">
                  {t(`common:languages.values.${language.key}`, {
                    lng: language.key,
                  })}
                </span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
