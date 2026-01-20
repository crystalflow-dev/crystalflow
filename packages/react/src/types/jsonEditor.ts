/**
 * JSON Editor Types
 */

/**
 * Editor mode configuration
 */
export type EditorMode = 'visual' | 'json' | 'split';

/**
 * JSON Editor theme
 */
export type JsonEditorTheme = 'vs-dark' | 'vs-light' | 'hc-black';

/**
 * JSON Editor options
 */
export interface JsonEditorOptions {
  /**
   * Whether to show the JSON editor
   */
  enabled: boolean;

  /**
   * Editor mode: visual only, JSON only, or split view
   */
  mode: EditorMode;

  /**
   * Monaco editor theme
   */
  theme?: JsonEditorTheme;

  /**
   * Whether to enable real-time validation
   */
  validateOnType?: boolean;

  /**
   * Whether to auto-format JSON
   */
  autoFormat?: boolean;

  /**
   * Whether changes in JSON editor sync to visual builder
   */
  syncToVisual?: boolean;

  /**
   * Whether changes in visual builder sync to JSON editor
   */
  syncToJson?: boolean;

  /**
   * Debounce delay for sync (ms)
   */
  syncDelay?: number;
}

/**
 * JSON validation error
 */
export interface JsonValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
