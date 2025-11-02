import {
    createContext,
    useContext,
} from 'react'

export enum THEMES {
    LIGHT = 'cupcake',
    DARK = 'dim'
}

export enum WSYIWYG_MODE {
    LIGHT = 'light',
    DARK = 'dark'
}

interface ThemeContextType {
    activeTheme: THEMES
    saveActiveTheme: (value: THEMES) => void;
    wysiwygMode: WSYIWYG_MODE
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

export const useThemeContext = () => {
    const context = useContext(ThemeContext)

    const { activeTheme, saveActiveTheme, wysiwygMode } = context || {}

    return {
        activeTheme, saveActiveTheme, wysiwygMode
    }
}
