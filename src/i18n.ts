import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from '../src/locales/ru.json';
import tk from '../src/locales/tk.json';
import en from '../src/locales/en.json';

const resources = {
  ru: {
    translation: ru,
  },
  tk: {
    translation: tk,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
