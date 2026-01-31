import React from 'react';
import { IoPlay, IoSave, IoFolder, IoTrash, IoArrowUndo, IoArrowRedo } from 'react-icons/io5';
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
 * Set to ReactNode to replace icon, null/false to remove icon, undefined to keep default
 */
export interface ToolbarIcons {
  /**
   * Execute button icon
   * @default <IoPlay />
   */
  execute?: React.ReactNode | null | false;
  /**
   * Save button icon
   * @default <IoSave />
   */
  save?: React.ReactNode | null | false;
  /**
   * Load button icon
   * @default <IoFolder />
   */
  load?: React.ReactNode | null | false;
  /**
   * Clear button icon
   * @default <IoTrash />
   */
  clear?: React.ReactNode | null | false;
  /**
   * Undo button icon
   * @default <IoArrowUndo />
   */
  undo?: React.ReactNode | null | false;
  /**
   * Redo button icon
   * @default <IoArrowRedo />
   */
  redo?: React.ReactNode | null | false;
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
    iconValue: React.ReactNode | null | false | undefined,
    defaultIcon: React.ReactNode
  ): React.ReactNode => {
    if (iconValue === null || iconValue === false) {
      return null; // Remove icon
    }
    return iconValue !== undefined ? iconValue : defaultIcon; // Custom or default
  };

  // Get icon values
  const executeIcon = renderIcon(icons?.execute, <IoPlay />);
  const saveIcon = renderIcon(icons?.save, <IoSave />);
  const loadIcon = renderIcon(icons?.load, <IoFolder />);
  const clearIcon = renderIcon(icons?.clear, <IoTrash />);
  const undoIcon = renderIcon(icons?.undo, <IoArrowUndo />);
  const redoIcon = renderIcon(icons?.redo, <IoArrowRedo />);
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
    opacity: 0.4,
    cursor: 'not-allowed',
    background: 'var(--reactflo-button-disabled, #f5f5f5)',
    color: 'var(--reactflo-text-disabled, #999)',
    border: '1px solid var(--reactflo-border-disabled, #e0e0e0)',
  };

  const defaultActiveStyle: React.CSSProperties = {
    background: 'var(--reactflo-status-success, #1b5e20)',
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
          {isExecuting ? (
            '⏳ Executing...'
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {executeIcon}
              <span>Execute</span>
            </span>
          )}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {saveIcon}
            <span>Save</span>
          </span>
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {loadIcon}
            <span>Load</span>
          </span>
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
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {clearIcon}
            <span>Clear</span>
          </span>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {undoIcon}
              <span>Undo</span>
            </span>
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
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {redoIcon}
              <span>Redo</span>
            </span>
          </button>
        </>
      )}
    </div>
  );
};
