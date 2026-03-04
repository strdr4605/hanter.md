import ro from './ro.json';
import ru from './ru.json';
import en from './en.json';

const translations = { ro, ru, en } as const;

export type Locale = keyof typeof translations;
export type Translations = typeof ro;

export const locales: Locale[] = ['ro', 'ru', 'en'];
export const defaultLocale: Locale = 'ro';

type PathsOf<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, string>
    ? PathsOf<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type TranslationKey = PathsOf<Translations>;

export function useTranslations(locale: string) {
  const lang = (locale in translations ? locale : defaultLocale) as Locale;
  const t = translations[lang];

  return function get(key: TranslationKey): string {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = t;
    for (const part of parts) {
      val = val?.[part];
    }
    return typeof val === 'string' ? val : key;
  };
}
