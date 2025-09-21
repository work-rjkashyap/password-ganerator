import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeProviderContext = createContext({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme
    } catch (e) {
      return defaultTheme
    }
  })

  useEffect(() => {
    const root = window.document.documentElement
    // keep both class and data-theme attribute in sync so CSS using either works
    root.classList.remove('light', 'dark')
    root.removeAttribute('data-theme')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      root.setAttribute('data-theme', systemTheme)
      return
    }

    root.classList.add(theme)
    root.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (t) => {
    try {
      localStorage.setItem(storageKey, t)
    } catch (e) {
      // ignore
    }
    setThemeState(t)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export default ThemeProvider
