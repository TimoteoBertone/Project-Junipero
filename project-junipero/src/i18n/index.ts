import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "./locales/en.json";
import es from "./locales/es.json";

/**
 * UI copy lives only in locale JSON files.
 * - Default / fallback language: English (`en`)
 * - Device locale selects a matching file when available (e.g. `es*`)
 * - Unknown locales fall back to English
 * Source code identifiers, comments, and schema names stay English.
 */
const SUPPORTED = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED)[number];

function resolveDeviceLanguage(): SupportedLocale {
  const code = Localization.getLocales()[0]?.languageCode?.toLowerCase() ?? "en";
  if (code.startsWith("es")) return "es";
  return "en";
}

void i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: resolveDeviceLanguage(),
  fallbackLng: "en",
  supportedLngs: [...SUPPORTED],
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
});

export default i18n;

export function setAppLanguage(lang: "system" | "en" | "es" | "pt") {
  if (lang === "system") {
    void i18n.changeLanguage(resolveDeviceLanguage());
    return;
  }
  // Portuguese (and other) locales: fall back to English until pt.json exists
  if (!SUPPORTED.includes(lang as SupportedLocale)) {
    void i18n.changeLanguage("en");
    return;
  }
  void i18n.changeLanguage(lang);
}
