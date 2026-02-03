/**
 * CSS imports as strings using Vite's ?raw suffix
 * All CSS files in this folder are automatically imported at build time and injected at runtime
 * Also imports React Flow styles so users don't need to import them manually
 */

// Import React Flow base styles
import reactFlowStyles from '@xyflow/react/dist/style.css?raw';

// Automatically import all CSS files in the styles folder as raw strings
const cssModules = import.meta.glob('./*.css', { query: '?raw', eager: true, import: 'default' });

// Extract global styles (must be injected first for CSS variables)
export const globalStyles = (cssModules['./global.css'] as string) || '';

// Combine React Flow styles + all other component styles (excluding global.css)
export const componentStyles = [
  reactFlowStyles,
  ...Object.entries(cssModules)
    .filter(([path]) => path !== './global.css')
    .map(([_, content]) => content as string),
].join('\n');

// Export individual styles for direct access if needed
export const propertyPanelStyles = (cssModules['./propertyPanel.css'] as string) || '';
export const resizablePanelStyles = (cssModules['./resizablePanel.css'] as string) || '';
export const customNodeStyles = (cssModules['./customNode.css'] as string) || '';
