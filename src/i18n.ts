import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/nws-client-cra-example/locales/{{lng}}/{{ns}}.json',
    },
    debug: true,
    defaultNS: "common",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // Not needed for react because it escapes by default.
    },
  });

export default i18n;
