import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import forecast from "../public/locales/en/forecast.json";
import glossary from "../public/locales/en/glossary.json";
import office from "../public/locales/en/office.json";
import product from "../public/locales/en/product.json";
import radar from "../public/locales/en/radar.json";
import station from "../public/locales/en/station.json";

i18n.use(initReactI18next).init({
  debug: false,
  defaultNS: "common",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // Not needed for react because it escapes by default.
  },
  lng: "en",
  ns: ["common"],
  resources: {
    en: { forecast, glossary, office, product, radar, station },
  },
});

export default i18n;
