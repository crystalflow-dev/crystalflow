import React from 'react';
import { ToolbarClasses, ToolbarStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';

/**
 * Toolbar Options - Configure which buttons to show
 */
export interface ToolbarOptions {
  /**
   * Show execute button
   * @default true
   */
  showExecute?: boolean;
  /**
   * Show save button
   * @default true
   */
  showSave?: boolean;
  /**
   * Show load button
   * @default true
   */
  showLoad?: boolean;
  /**
   * Show clear button
   * @default true
   */
  showClear?: boolean;
  /**
   * Show undo/redo buttons
   * @default false
   */
  showUndoRedo?: boolean;
}

/**
 * Toolbar Icons - Customize button icons
 * Set to string to replace icon, null/false/'' to remove icon, undefined to keep default
 */
export interface ToolbarIcons {
  /**
   * Execute button icon
   * @default '▶️'
   */
  execute?: string | null | false;
  /**
   * Save button icon
   * @default '💾'
   */
  save?: string | null | false;
  /**
   * Load button icon
   * @default '📁'
   */
  load?: string | null | false;
  /**
   * Clear button icon
   * @default '🗑️'
   */
  clear?: string | null | false;
  /**
   * Undo button icon
   * @default '↶'
   */
  undo?: string | null | false;
  /**
   * Redo button icon
   * @default '↷'
   */
  redo?: string | null | false;
}

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
   * Configure which toolbar buttons to show
   */
  options?: ToolbarOptions;

  /**
   * Customize or remove button icons
   * @example { execute: '▶', save: '💾', load: null } // Custom execute/save icons, no load icon
   */
  icons?: ToolbarIcons;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Class name overrides for sub-components
   */
  classes?: ToolbarClasses;

  /**
   * Style overrides for sub-components
   */
  styles?: ToolbarStyles;
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
  options,
  icons,
  style,
  className,
  classes,
  styles,
}) => {
  // Apply defaults to options
  const {
    showExecute = true,
    showSave = true,
    showLoad = true,
    showClear = true,
    showUndoRedo = false,
  } = options || {};

  // Helper function to render icon
  const renderIcon = (
    iconValue: string | null | false | undefined,
    defaultIcon: string
  ): string => {
    if (iconValue === null || iconValue === false || iconValue === '') {
      return ''; // Remove icon
    }
    return iconValue !== undefined ? iconValue : defaultIcon; // Custom or default
  };

  // Get icon values
  const executeIcon = renderIcon(icons?.execute, '▶️');
  const saveIcon = renderIcon(icons?.save, '💾');
  const loadIcon = renderIcon(icons?.load, '📁');
  const clearIcon = renderIcon(icons?.clear, '🗑️');
  const undoIcon = renderIcon(icons?.undo, '↶');
  const redoIcon = renderIcon(icons?.redo, '↷');
  const defaultRootStyle: React.CSSProperties = {
    padding: '10px',
    borderBottom: '1px solid var(--reactflo-toolbar-border, #ddd)',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: 'var(--reactflo-toolbar-bg, #f9f9f9)',
    color: 'var(--reactflo-toolbar-text, #333)',
  };

  const defaultButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid var(--reactflo-border-primary, #ccc)',
    background: 'var(--reactflo-button-secondary, white)',
    color: 'var(--reactflo-button-text, #333)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  };

  const defaultDisabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: '#4a4a4a',
    color: '#999',
    border: '1px solid #555',
  };

  const defaultActiveStyle: React.CSSProperties = {
    background: 'var(--reactflo-status-success, #4CAF50)',
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div
      className={cn(className, classes?.root)}
      style={mergeStyles(defaultRootStyle, styles?.root, style)}
    >
      {/* Execute Button */}
      {showExecute && (
        <button
          onClick={onExecute}
          disabled={!canExecute || isExecuting}
          className={cn(classes?.button, isExecuting && classes?.buttonActive)}
          style={mergeStyles(
            defaultButtonStyle,
            canExecute && !isExecuting ? defaultActiveStyle : defaultDisabledStyle,
            styles?.button,
            isExecuting ? styles?.buttonActive : undefined
          )}
          title="Execute workflow"
        >
          {isExecuting ? '⏳ Executing...' : `${executeIcon}${executeIcon ? ' ' : ''}Execute`}
        </button>
      )}

      {/* Save Button */}
      {showSave && (
        <button
          onClick={onSave}
          className={classes?.button}
          style={mergeStyles(defaultButtonStyle, styles?.button)}
          title="Save workflow"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-button-hover, #f0f0f0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-button-secondary, white)';
          }}
        >
          {saveIcon && `${saveIcon} `}Save
        </button>
      )}

      {/* Load Button */}
      {showLoad && (
        <button
          onClick={onLoad}
          className={classes?.button}
          style={mergeStyles(defaultButtonStyle, styles?.button)}
          title="Load workflow"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-button-hover, #f0f0f0)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-button-secondary, white)';
          }}
        >
          {loadIcon && `${loadIcon} `}Load
        </button>
      )}

      {/* Clear Button */}
      {showClear && (
        <button
          onClick={onClear}
          className={classes?.button}
          style={mergeStyles(defaultButtonStyle, styles?.button)}
          title="Clear canvas"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-status-error, #fee)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--reactflo-button-secondary, white)';
          }}
        >
          {clearIcon && `${clearIcon} `}Clear
        </button>
      )}

      {showUndoRedo && (
        <>
          <div style={{ width: '1px', height: '24px', background: '#ddd' }} />

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={cn(classes?.button, !canUndo && classes?.buttonDisabled)}
            style={mergeStyles(
              defaultButtonStyle,
              !canUndo ? defaultDisabledStyle : undefined,
              styles?.button,
              !canUndo ? styles?.buttonDisabled : undefined
            )}
            title="Undo"
          >
            {undoIcon && `${undoIcon} `}Undo
          </button>

          {/* Redo Button */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={cn(classes?.button, !canRedo && classes?.buttonDisabled)}
            style={mergeStyles(
              defaultButtonStyle,
              !canRedo ? defaultDisabledStyle : undefined,
              styles?.button,
              !canRedo ? styles?.buttonDisabled : undefined
            )}
            title="Redo"
          >
            {redoIcon && `${redoIcon} `}Redo
          </button>
        </>
      )}
    </div>
  );
};
