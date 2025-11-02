import { useCallback, useEffect, useState } from 'react'
import { THEMES, ThemeContext, WSYIWYG_MODE } from './theme-context'

const STORAGE_KEY = 'theme'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeTheme, storeActiveTheme] = useState<THEMES>(THEMES.LIGHT)
    const [wysiwygMode, setWysiwygMode] = useState<WSYIWYG_MODE>(WSYIWYG_MODE.LIGHT)

    // Set the selected (or default) theme for the user
    const setActiveTheme = (theme: THEMES) => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
        storeActiveTheme(theme)
        setWysiwygMode(theme === THEMES.LIGHT ? WSYIWYG_MODE.LIGHT : WSYIWYG_MODE.DARK)
    }

    // Save the selected (or default) theme for a consistent experience
    const saveActiveTheme = useCallback((theme: THEMES) => {
        localStorage.setItem(STORAGE_KEY, theme)
        setActiveTheme(theme)
    }, [])

    // The default theme (in index.html) is set to light mode.
    // This useEffect will attempt to see if this is a returning
    // visitor and maintain the theme they last experienced.
    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEY) as THEMES

        // Set active theme (default light ignored as that's the fallback)
        if (savedTheme) {
            setActiveTheme(savedTheme)
        }
    }, [saveActiveTheme])

    return (
        <ThemeContext.Provider
            value={{
                activeTheme,
                saveActiveTheme,
                wysiwygMode
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}