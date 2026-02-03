/**
 * Mock for cssInJs module for Jest tests
 * Vite-specific import.meta.glob is not available in Jest
 */

export const globalStyles = '/* mocked global styles */';
export const componentStyles = '/* mocked component styles */';
export const propertyPanelStyles = '/* mocked property panel styles */';
export const resizablePanelStyles = '/* mocked resizable panel styles */';
export const customNodeStyles = '/* mocked custom node styles */';

export default {
  globalStyles,
  componentStyles,
  propertyPanelStyles,
  resizablePanelStyles,
  customNodeStyles,
};
