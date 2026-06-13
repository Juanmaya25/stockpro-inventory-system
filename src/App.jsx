import { ThemeProvider } from './context/ThemeContext';
import { AppShell } from './app/AppShell';

/**
 * Composition root: provides the theme to the tree and renders the shell.
 * All domain logic lives in src/hooks + src/utils; all UI in src/components.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
