import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('kokalos_lang') || 'IT';
  });

  useEffect(() => {
    localStorage.setItem('kokalos_lang', language);
  }, [language]);

  const t = translations[language] || translations.IT;

  const getLocalizedField = (item, fieldName) => {
    if (!item) return '';
    if (language === 'EN' && item[fieldName + 'En']) return item[fieldName + 'En'];
    if (language === 'FR' && item[fieldName + 'Fr']) return item[fieldName + 'Fr'];
    if (language === 'DE' && item[fieldName + 'De']) return item[fieldName + 'De'];
    return item[fieldName] || item[fieldName + 'It'] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedField }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
