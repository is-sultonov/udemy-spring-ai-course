import { ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const resources = {
  en: { translation: enTranslations },
  es: { translation: esTranslations },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'speech-to-text-language',
      caches: ['localStorage'],
    },
  });

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Set document language attribute
    document.documentElement.lang = i18n.language;
    
    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng;
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return <>{children}</>;
}

export default i18n;