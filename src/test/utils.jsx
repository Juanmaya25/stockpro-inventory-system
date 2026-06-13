import { render } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';

/** Renders a component inside the ThemeProvider, like the real app does. */
export const renderWithTheme = (ui, options) =>
  render(ui, { wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>, ...options });
