import React, { createContext, useContext, useState, useEffect } from 'react';

// Define language identifiers
export type Language = 'en' | 'es' | 'hi';

// Language storage key
const LANGUAGE_STORAGE_KEY = 'preferred_language';

// Translations for UI elements
const translations = {
  en: {
    home: "Home",
    software: "Software",
    reviews: "Reviews",
    howToInstall: "How to Install",
    download: "Download",
    downloadNow: "Download Now",
    exploreMore: "Discover Tools",
    softwareCatalog: "Software Catalog",
    browseCollection: "Browse our collection of premium",
    softwareTools: "software tools",
    searchSoftware: "Search software...",
    userReviews: "User Reviews",
    seeWhatUsers: "See what our users say about their experience with our tools",
    howToInstallSection: "How to Install",
    followSteps: "Follow these simple steps to get started with your software",
    downloadStep: "Download",
    downloadDesc: "Download your selected software from our catalog.",
    extractStep: "Extract Files",
    extractDesc: "Extract the archive using the provided password.",
    installStep: "Install",
    installDesc: "Run the installer and follow the setup instructions.",
    activateStep: "Activate",
    activateDesc: "Apply the included patch to activate the software.",
    copyrightRights: "All rights reserved.",
    version: "Version",
    releaseDate: "Release Date",
    features: "Features",
    systemRequirements: "System Requirements",
    installationSteps: "Installation Steps",
    password: "Password",
    passwordForArchive: "Password for archive",
    copy: "Copy",
    close: "Close"
  },
  es: {
    home: "Inicio",
    software: "Software",
    reviews: "Reseñas",
    howToInstall: "Cómo Instalar",
    download: "Descargar",
    downloadNow: "Descargar Ahora",
    exploreMore: "Descubrir Herramientas",
    softwareCatalog: "Catálogo de Software",
    browseCollection: "Explora nuestra colección de",
    softwareTools: "herramientas de software premium",
    searchSoftware: "Buscar software...",
    userReviews: "Reseñas de Usuarios",
    seeWhatUsers: "Mira lo que nuestros usuarios dicen sobre su experiencia con nuestras herramientas",
    howToInstallSection: "Cómo Instalar",
    followSteps: "Sigue estos simples pasos para comenzar con tu software",
    downloadStep: "Descargar",
    downloadDesc: "Descarga tu software seleccionado desde nuestro catálogo.",
    extractStep: "Extraer Archivos",
    extractDesc: "Extrae el archivo usando la contraseña proporcionada.",
    installStep: "Instalar",
    installDesc: "Ejecuta el instalador y sigue las instrucciones de configuración.",
    activateStep: "Activar",
    activateDesc: "Aplica el parche incluido para activar el software.",
    copyrightRights: "Todos los derechos reservados.",
    version: "Versión",
    releaseDate: "Fecha de Lanzamiento",
    features: "Características",
    systemRequirements: "Requisitos del Sistema",
    installationSteps: "Pasos de Instalación",
    password: "Contraseña",
    passwordForArchive: "Contraseña para el archivo",
    copy: "Copiar",
    close: "Cerrar"
  },
  hi: {
    home: "होम",
    software: "सॉफ्टवेयर",
    reviews: "समीक्षाएँ",
    howToInstall: "इंस्टॉल कैसे करें",
    download: "डाउनलोड करें",
    downloadNow: "अभी डाउनलोड करें",
    exploreMore: "टूल्स खोजें",
    softwareCatalog: "सॉफ्टवेयर कैटलॉग",
    browseCollection: "हमारे प्रीमियम",
    softwareTools: "सॉफ्टवेयर टूल्स का संग्रह देखें",
    searchSoftware: "सॉफ्टवेयर खोजें...",
    userReviews: "उपयोगकर्ता समीक्षाएँ",
    seeWhatUsers: "देखें कि हमारे उपयोगकर्ता हमारे टूल्स के साथ अपने अनुभव के बारे में क्या कहते हैं",
    howToInstallSection: "इंस्टॉल कैसे करें",
    followSteps: "अपने सॉफ्टवेयर के साथ शुरुआत करने के लिए इन सरल चरणों का पालन करें",
    downloadStep: "डाउनलोड",
    downloadDesc: "हमारे कैटलॉग से अपना चुना हुआ सॉफ्टवेयर डाउनलोड करें।",
    extractStep: "फाइलें निकालें",
    extractDesc: "दिए गए पासवर्ड का उपयोग करके आर्काइव को एक्सट्रैक्ट करें।",
    installStep: "इंस्टॉल करें",
    installDesc: "इंस्टॉलर चलाएं और सेटअप निर्देशों का पालन करें।",
    activateStep: "सक्रिय करें",
    activateDesc: "सॉफ्टवेयर को सक्रिय करने के लिए शामिल पैच लागू करें।",
    copyrightRights: "सर्वाधिकार सुरक्षित।",
    version: "संस्करण",
    releaseDate: "रिलीज़ की तारीख",
    features: "विशेषताएं",
    systemRequirements: "सिस्टम आवश्यकताएं",
    installationSteps: "इंस्टॉलेशन के चरण",
    password: "पासवर्ड",
    passwordForArchive: "आर्काइव के लिए पासवर्ड",
    copy: "कॉपी",
    close: "बंद करें"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (savedLanguage as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
