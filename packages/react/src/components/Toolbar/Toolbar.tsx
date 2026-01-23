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
  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const disabledStyle: React.CSSProperties = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <div
      className={className}
      style={{
        padding: '10px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        ...style,
      }}
    >
      {/* Execute Button */}
      <button
        onClick={onExecute}
        disabled={!canExecute || isExecuting}
        style={{
          ...buttonStyle,
          background: canExecute && !isExecuting ? '#4CAF50' : '#ccc',
          color: 'white',
          fontWeight: 'bold',
        }}
        title="Execute workflow"
      >
        {isExecuting ? '⏳ Executing...' : '▶ Execute'}
      </button>

      <div style={{ width: '1px', height: '24px', background: '#ddd' }} />

      {/* Save Button */}
      <button
        onClick={onSave}
        style={buttonStyle}
        title="Save workflow"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        💾 Save
      </button>

      {/* Load Button */}
      <button
        onClick={onLoad}
        style={buttonStyle}
        title="Load workflow"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        📁 Load
      </button>

      {/* Clear Button */}
      <button
        onClick={onClear}
        style={buttonStyle}
        title="Clear canvas"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fee';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
      >
        🗑️ Clear
      </button>

      <div style={{ width: '1px', height: '24px', background: '#ddd' }} />

      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        style={canUndo ? buttonStyle : disabledStyle}
        title="Undo"
      >
        ↶ Undo
      </button>

      {/* Redo Button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        style={canRedo ? buttonStyle : disabledStyle}
        title="Redo"
      >
        ↷ Redo
      </button>
    </div>
  );
};
