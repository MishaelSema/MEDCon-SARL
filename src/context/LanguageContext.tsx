'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/lib/translations/en'
import fr from '@/lib/translations/fr'

type Language = 'en' | 'fr'

type Translations = {
    [key: string]: string | { [key: string]: string | { [key: string]: string } }
}

const translations: Record<Language, Translations> = { en, fr }

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en')

    useEffect(() => {
        const saved = localStorage.getItem('med-lang') as Language
        if (saved && (saved === 'en' || saved === 'fr')) {
            setLanguageState(saved)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem('med-lang', lang)
        document.documentElement.lang = lang
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[language]
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k]
            } else {
                return key
            }
        }
        
        return typeof value === 'string' ? value : key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}
