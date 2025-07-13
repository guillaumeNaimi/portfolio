import locales from '@/locales';

export type Language = {
  key: keyof typeof locales;
  dir?: 'ltr' | 'rtl';
  fontScale?: number;
};

export type LanguageKey = keyof typeof locales;

export const DEFAULT_LANGUAGE_KEY: LanguageKey = 'en';
export const DEFAULT_NAMESPACE = 'common';

export const AVAILABLE_LANGUAGES = [
  {
    key: 'en',
  } as const,
  {
    key: 'fr',
  } as const,
] satisfies Language[];
