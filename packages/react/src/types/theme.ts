/**
 * Theme system for ReactFlo
 */

/**
 * Color palette for a theme
 */
export interface ThemeColors {
  // Background colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };

  // Border colors
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };

  // Component-specific colors
  toolbar: {
    background: string;
    text: string;
    border: string;
  };

  palette: {
    background: string;
    categoryHeader: string;
    itemHover: string;
    text: string;
    textSecondary: string;
  };

  properties: {
    background: string;
    header: string;
    text: string;
    border: string;
  };

  canvas: {
    background: string;
    grid: string;
  };

  node: {
    background: string;
    border: string;
    text: string;
    header: string;
    shadow: string;
  };

  // React Flow specific colors
  reactflow: {
    edge: string;
    edgeSelected: string;
    handle: string;
    handleHover: string;
    connectionLine: string;
    selectionRect: string;
    miniMapBackground: string;
    miniMapMask: string;
    controlsBackground: string;
    controlsShadow: string;
  };

  // Interactive states
  button: {
    primary: string;
    secondary: string;
    hover: string;
    active: string;
    disabled: string;
    text: string;
  };

  // Status colors
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
}

/**
 * Complete theme configuration
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

/**
 * Light theme (default)
 */
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f9f9f9',
      tertiary: '#f5f5f5',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
    },
    border: {
      primary: '#dddddd',
      secondary: '#e0e0e0',
      focus: '#3498db',
    },
    toolbar: {
      background: '#f9f9f9',
      text: '#333333',
      border: '#dddddd',
    },
    palette: {
      background: '#ffffff',
      categoryHeader: '#f5f5f5',
      itemHover: '#f0f0f0',
      text: '#333333',
      textSecondary: '#666666',
    },
    properties: {
      background: '#ffffff',
      header: '#f5f5f5',
      text: '#333333',
      border: '#dddddd',
    },
    canvas: {
      background: '#fafafa',
      grid: '#e0e0e0',
    },
    node: {
      background: '#ffffff',
      border: '#dddddd',
      text: '#333333',
      header: '#f5f5f5',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    button: {
      primary: '#3498db',
      secondary: '#ffffff',
      hover: '#f0f0f0',
      active: '#2980b9',
      disabled: '#cccccc',
      text: '#333333',
    },
    status: {
      success: '#27ae60',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
    },
    reactflow: {
      edge: '#b1b1b7',
      edgeSelected: '#3498db',
      handle: '#3498db',
      handleHover: '#2980b9',
      connectionLine: '#3498db',
      selectionRect: '#3498db',
      miniMapBackground: '#ffffff',
      miniMapMask: '#f5f5f5',
      controlsBackground: '#ffffff',
      controlsShadow: 'rgba(0, 0, 0, 0.1)',
    },
  },
};

/**
 * Dark theme
 */
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: {
      primary: '#1e1e1e',
      secondary: '#2d2d2d',
      tertiary: '#3d3d3d',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0b0b0',
      disabled: '#606060',
    },
    border: {
      primary: '#404040',
      secondary: '#4d4d4d',
      focus: '#5dade2',
    },
    toolbar: {
      background: '#2d2d2d',
      text: '#e0e0e0',
      border: '#404040',
    },
    palette: {
      background: '#252525',
      categoryHeader: '#2d2d2d',
      itemHover: '#3d3d3d',
      text: '#e0e0e0',
      textSecondary: '#b0b0b0',
    },
    properties: {
      background: '#252525',
      header: '#2d2d2d',
      text: '#e0e0e0',
      border: '#404040',
    },
    canvas: {
      background: '#1a1a1a',
      grid: '#333333',
    },
    node: {
      background: '#2d2d2d',
      border: '#404040',
      text: '#e0e0e0',
      header: '#3d3d3d',
      shadow: 'rgba(0, 0, 0, 0.4)',
    },
    button: {
      primary: '#5dade2',
      secondary: '#2d2d2d',
      hover: '#3d3d3d',
      active: '#3498db',
      disabled: '#404040',
      text: '#e0e0e0',
    },
    status: {
      success: '#2ecc71',
      error: '#e74c3c',
      warning: '#f39c12',
      info: '#5dade2',
    },
    reactflow: {
      edge: '#555',
      edgeSelected: '#5dade2',
      handle: '#5dade2',
      handleHover: '#3498db',
      connectionLine: '#5dade2',
      selectionRect: '#5dade2',
      miniMapBackground: '#2d2d2d',
      miniMapMask: '#1e1e1e',
      controlsBackground: '#2d2d2d',
      controlsShadow: 'rgba(0, 0, 0, 0.4)',
    },
  },
};

/**
 * Create custom theme based on light or dark theme
 */
export function createTheme(mode: 'light' | 'dark', overrides?: Partial<ThemeColors>): Theme {
  const baseTheme = mode === 'dark' ? darkTheme : lightTheme;

  if (!overrides) {
    return baseTheme;
  }

  return {
    mode,
    colors: {
      ...baseTheme.colors,
      ...overrides,
      background: { ...baseTheme.colors.background, ...overrides.background },
      text: { ...baseTheme.colors.text, ...overrides.text },
      border: { ...baseTheme.colors.border, ...overrides.border },
      toolbar: { ...baseTheme.colors.toolbar, ...overrides.toolbar },
      palette: { ...baseTheme.colors.palette, ...overrides.palette },
      properties: { ...baseTheme.colors.properties, ...overrides.properties },
      canvas: { ...baseTheme.colors.canvas, ...overrides.canvas },
      node: { ...baseTheme.colors.node, ...overrides.node },
      button: { ...baseTheme.colors.button, ...overrides.button },
      status: { ...baseTheme.colors.status, ...overrides.status },
      reactflow: { ...baseTheme.colors.reactflow, ...overrides.reactflow },
    },
  };
}

/**
 * Convert theme colors to CSS variables
 * These variables are used by both ReactFlo and ReactFlow components
 */
export function themeToCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--reactflo-bg-primary': theme.colors.background.primary,
    '--reactflo-bg-secondary': theme.colors.background.secondary,
    '--reactflo-bg-tertiary': theme.colors.background.tertiary,
    '--reactflo-text-primary': theme.colors.text.primary,
    '--reactflo-text-secondary': theme.colors.text.secondary,
    '--reactflo-text-disabled': theme.colors.text.disabled,
    '--reactflo-border-primary': theme.colors.border.primary,
    '--reactflo-border-secondary': theme.colors.border.secondary,
    '--reactflo-border-focus': theme.colors.border.focus,
    '--reactflo-toolbar-bg': theme.colors.toolbar.background,
    '--reactflo-toolbar-text': theme.colors.toolbar.text,
    '--reactflo-toolbar-border': theme.colors.toolbar.border,
    '--reactflo-palette-bg': theme.colors.palette.background,
    '--reactflo-palette-header': theme.colors.palette.categoryHeader,
    '--reactflo-palette-hover': theme.colors.palette.itemHover,
    '--reactflo-palette-text': theme.colors.palette.text,
    '--reactflo-palette-text-secondary': theme.colors.palette.textSecondary,
    '--reactflo-properties-bg': theme.colors.properties.background,
    '--reactflo-properties-header': theme.colors.properties.header,
    '--reactflo-properties-text': theme.colors.properties.text,
    '--reactflo-properties-border': theme.colors.properties.border,
    '--reactflo-canvas-bg': theme.colors.canvas.background,
    '--reactflo-canvas-grid': theme.colors.canvas.grid,
    '--reactflo-node-bg': theme.colors.node.background,
    '--reactflo-node-border': theme.colors.node.border,
    '--reactflo-node-text': theme.colors.node.text,
    '--reactflo-node-header': theme.colors.node.header,
    '--reactflo-node-shadow': theme.colors.node.shadow,
    '--reactflo-button-primary': theme.colors.button.primary,
    '--reactflo-button-secondary': theme.colors.button.secondary,
    '--reactflo-button-hover': theme.colors.button.hover,
    '--reactflo-button-active': theme.colors.button.active,
    '--reactflo-button-disabled': theme.colors.button.disabled,
    '--reactflo-button-text': theme.colors.button.text,
    '--reactflo-status-success': theme.colors.status.success,
    '--reactflo-status-error': theme.colors.status.error,
    '--reactflo-status-warning': theme.colors.status.warning,
    '--reactflo-status-info': theme.colors.status.info,
    // React Flow specific variables
    '--reactflo-edge-color': theme.colors.reactflow.edge,
    '--reactflo-edge-selected': theme.colors.reactflow.edgeSelected,
    '--reactflo-handle-color': theme.colors.reactflow.handle,
    '--reactflo-handle-hover': theme.colors.reactflow.handleHover,
    '--reactflo-connection-line': theme.colors.reactflow.connectionLine,
    '--reactflo-selection-rect': theme.colors.reactflow.selectionRect,
    '--reactflo-minimap-bg': theme.colors.reactflow.miniMapBackground,
    '--reactflo-minimap-mask': theme.colors.reactflow.miniMapMask,
    '--reactflo-controls-bg': theme.colors.reactflow.controlsBackground,
    '--reactflo-controls-shadow': theme.colors.reactflow.controlsShadow,
  };
}

/**
 * Detect system theme preference
 */
export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
