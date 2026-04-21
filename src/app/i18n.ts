import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Logout": "Logout",
          "Admin": "Admin",
          "Doctor": "Doctor",
          "Patient": "Patient",
          "Command Center": "Command Center",
          "Pulse AI Assistant": "Pulse AI Assistant"
        }
      },
      hi: {
        translation: {
          "Logout": "लॉग आउट",
          "Admin": "व्यवस्थापक",
          "Doctor": "डॉक्टर",
          "Patient": "मरीज",
          "Command Center": "कमांड सेंटर",
          "Pulse AI Assistant": "पल्स एआई असिस्टेंट"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
