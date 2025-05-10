import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Import translations
import enTranslation from "./locales/en.json"
import frTranslation from "./locales/fr.json"
import swTranslation from "./locales/sw.json"

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    fr: {
      translation: frTranslation,
    },
    sw: {
      translation: swTranslation,
    },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
})

export default i18n
