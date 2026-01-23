import React from 'react';

/**
 * Toolbar Props
 */
export interface ToolbarProps {
  /**
   * Whether workflow can be executed
   */
  canExecute?: boolean;

  /**
   * Whether workflow is currently executing
   */
  isExecuting?: boolean;

  /**
   * Callback for execute button
   */
  onExecute?: () => void;

  /**
   * Callback for save button
   */
  onSave?: () => void;

  /**
   * Callback for load button
   */
  onLoad?: () => void;

  /**
   * Callback for clear button
   */
  onClear?: () => void;

  /**
   * Callback for undo
   */
  onUndo?: () => void;

  /**
   * Callback for redo
   */
  onRedo?: () => void;

  /**
   * Whether undo is available
   */
  canUndo?: boolean;

  /**
   * Whether redo is available
   */
  canRedo?: boolean;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Toolbar component
 *
 * Provides workflow actions like execute, save, load, clear, undo/redo.
 *
 * Features:
 * - Execute workflow button
 * - Save/Load workflow
 * - Clear canvas
 * - Undo/Redo actions
 * - Zoom controls
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  canExecute = false,
  isExecuting = false,
  onExecute,
  onSave,
  onLoad,
  onClear,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  style,
  className,
}) => {
  // TODO: Implement toolbar
  // - Add action buttons
  // - Handle click events
  // - Show loading state
  // - Disable buttons when appropriate

  return (
    <div
      className={className}
      style={{
        padding: '10px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        ...style,
      }}
    >
      <button
        onClick={onExecute}
        disabled={!canExecute || isExecuting}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: canExecute && !isExecuting ? '#4CAF50' : '#ccc',
          color: 'white',
          cursor: canExecute && !isExecuting ? 'pointer' : 'not-allowed',
        }}
      >
        {isExecuting ? 'Executing...' : 'Execute'}
      </button>

      <button
        onClick={onSave}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        Save
      </button>

      <button
        onClick={onLoad}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        Load
      </button>

      <button
        onClick={onClear}
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        Clear
      </button>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: canUndo ? 'pointer' : 'not-allowed',
          }}
        >
          Undo
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: canRedo ? 'pointer' : 'not-allowed',
          }}
        >
          Redo
        </button>
      </div>
    </div>
  );
};
