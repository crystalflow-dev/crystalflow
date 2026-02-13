/**
 * Default theme for CrystalFlow
 * This theme is used when no custom theme is provided
 */

export interface ColorShades {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
}

export interface DefaultTheme {
  colors: {
    primary: ColorShades;
    gray: Required<ColorShades>;
    semantic: {
      success: ColorShades;
      warning: ColorShades;
      error: ColorShades;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
    };
    border: {
      light: string;
      medium: string;
      strong: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
  };
  typography: {
    fontFamily: {
      base: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    12: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      out: string;
      in: string;
      inOut: string;
    };
  };
}

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: {
      50: '#f0f4ff',
      100: '#e0edff',
      500: '#2A41FF',
      600: '#1d2edb',
      700: '#1821b8',
    },
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    semantic: {
      success: {
        50: '#ecfdf5',
        500: '#10b981',
        600: '#059669',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
      },
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      elevated: '#ffffff',
    },
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      strong: '#94a3b8',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
    },
  },
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      out: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0.0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  },
};
