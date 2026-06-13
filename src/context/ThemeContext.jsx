import { createContext, useCallback, useMemo, useState } from 'react';
import { themes, makeStyles, makeFocusHandlers } from '../styles/theme';

export const ThemeContext = createContext(null);

/**
 * Provides the active palette (C), the derived style primitives (S) and the
 * input focus handlers to the whole tree, so components never receive
 * theme objects through props.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(() => {
    const C = themes[theme];
    return { theme, toggleTheme, C, S: makeStyles(C), focusH: makeFocusHandlers(C) };
  }, [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
