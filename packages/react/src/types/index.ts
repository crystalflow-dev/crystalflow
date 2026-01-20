/**
 * @reactflo/react types
 */

export * from './jsonEditor';

/**
 * Workflow Builder Props
 */
export interface WorkflowBuilderProps {
  /**
   * Array of node classes to make available
   */
  nodes: any[];

  /**
   * Initial workflow data
   */
  initialWorkflow?: any;

  /**
   * Whether to show the JSON editor
   */
  showJsonEditor?: boolean;

  /**
   * Editor mode
   */
  editorMode?: 'visual' | 'json' | 'split';

  /**
   * JSON editor theme
   */
  jsonEditorTheme?: 'vs-dark' | 'vs-light' | 'hc-black';

  /**
   * Callback when workflow changes
   */
  onWorkflowChange?: (workflow: any) => void;

  /**
   * Callback when execution completes
   */
  onExecute?: (result: any) => void;

  /**
   * Callback when execution fails
   */
  onError?: (error: Error) => void;

  /**
   * Whether to enable auto-save
   */
  autoSave?: boolean;

  /**
   * Auto-save interval (ms)
   */
  autoSaveInterval?: number;
}
