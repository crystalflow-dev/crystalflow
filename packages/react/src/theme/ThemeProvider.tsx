/**
 * Theme Provider for ReactFlo
 * Manages theme state and applies CSS custom properties
 */

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { defaultTheme, type DefaultTheme } from './defaultTheme';

interface ThemeContextValue {
  theme: DefaultTheme;
  setTheme: (theme: Partial<DefaultTheme>) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<DefaultTheme>;
}

/**
 * Flattens nested theme object into CSS custom property format
 * Example: { colors: { primary: { 500: '#2A41FF' } } }
 * becomes: { '--theme-primary-500': '#2A41FF' }
 */
function flattenTheme(obj: any, prefix = '--theme'): Record<string, string> {
  const result: Record<string, string> = {};

  function flatten(current: any, path: string) {
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      Object.entries(current).forEach(([key, value]) => {
        const newPath = path ? `${path}-${key}` : key;
        flatten(value, newPath);
      });
    } else if (typeof current === 'string' || typeof current === 'number') {
      result[`${prefix}-${path}`] = String(current);
    }
  }

  flatten(obj, '');
  return result;
}

/**
 * Theme Provider Component
 * Wraps the application and provides theme context
 */
export function ThemeProvider({ children, theme: customTheme }: ThemeProviderProps) {
  const theme = useMemo(() => {
    if (!customTheme) return defaultTheme;

    // Deep merge custom theme with default theme
    return {
      colors: { ...defaultTheme.colors, ...customTheme.colors },
      typography: { ...defaultTheme.typography, ...customTheme.typography },
      spacing: { ...defaultTheme.spacing, ...customTheme.spacing },
      radius: { ...defaultTheme.radius, ...customTheme.radius },
      shadows: { ...defaultTheme.shadows, ...customTheme.shadows },
      transitions: { ...defaultTheme.transitions, ...customTheme.transitions },
    } as DefaultTheme;
  }, [customTheme]);

  // Apply theme to CSS custom properties
  useEffect(() => {
    if (!customTheme) return;

    const flatTheme = flattenTheme(customTheme);
    const root = document.documentElement;

    // Set custom properties
    Object.entries(flatTheme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Cleanup function to remove custom properties
    return () => {
      Object.keys(flatTheme).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [customTheme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: () => {
        // Future: Implement runtime theme switching if needed
        console.warn('Runtime theme switching not yet implemented');
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default theme if no provider is found
    return {
      theme: defaultTheme,
      setTheme: () => {
        console.warn('ThemeProvider not found in component tree');
      },
    };
  }
  return context;
}
