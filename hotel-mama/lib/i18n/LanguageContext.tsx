"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

type Language = 'en' | 'es'
type TranslationKey = keyof typeof translations.en | keyof typeof translations.es
type TranslationValue = typeof translations.en[TranslationKey] | typeof translations.es[TranslationKey]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (section: string, key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Intentar obtener el idioma guardado
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (section: string, key: string): string => {
    try {
      const sectionParts = section.split('.')
      let translation: any = translations[language]
      
      // Navegar a través de las partes de la sección
      for (const part of sectionParts) {
        if (translation && typeof translation === 'object' && part in translation) {
          translation = translation[part]
        } else {
          throw new Error(`Translation not found for section: ${section}`)
        }
      }
      
      // Obtener el valor final usando la clave
      if (translation && typeof translation === 'object' && key in translation) {
        const finalTranslation = translation[key]
        return typeof finalTranslation === 'string' ? finalTranslation : key
      }
      
      throw new Error(`Translation not found for ${section}.${key}`)
    } catch (error) {
      console.warn(`Translation error: ${error}`)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 