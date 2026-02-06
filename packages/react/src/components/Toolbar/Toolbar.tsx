import React from 'react';
import {
  IoPlay,
  IoSave,
  IoFolder,
  IoTrash,
  IoArrowUndo,
  IoArrowRedo,
  IoMap,
  IoGrid,
} from 'react-icons/io5';
import { ToolbarClasses, ToolbarStyles } from '../../types/styling';
import { cn, mergeStyles } from '../../utils/styling';
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi';

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
   * Show clear execution button
   * @default true
   */
  showClearExecution?: boolean;
  /**
   * Show undo/redo buttons
   * @default false
   */
  showUndoRedo?: boolean;
  /**
   * Show UI settings section
   * @default true
   */
  showUISettings?: boolean;
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
   * Clear execution button icon
   * @default 🔄
   */
  clearExecution?: React.ReactNode | null | false;
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
  /**
   * Minimap toggle icon
   * @default <IoMap />
   */
  minimap?: React.ReactNode | null | false;
  /**
   * Flow controls toggle icon
   * @default <IoGrid />
   */
  flowControls?: React.ReactNode | null | false;
  /**
   * Fullscreen toggle icon
   * @default <IoExpand /> or <IoContract />
   */
  fullscreen?: React.ReactNode | null | false;
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
   * Callback for clearing execution visual state
   */
  onClearExecution?: () => void;

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
   * Whether minimap is shown
   */
  showMinimap?: boolean;

  /**
   * Callback for toggling minimap visibility
   */
  onToggleMinimap?: (show: boolean) => void;

  /**
   * Whether flow controls are shown
   */
  showFlowControls?: boolean;

  /**
   * Callback for toggling flow controls visibility
   */
  onToggleFlowControls?: (show: boolean) => void;

  /**
   * Whether workflow builder is in fullscreen mode
   */
  isFullscreen?: boolean;

  /**
   * Callback for toggling fullscreen mode
   */
  onToggleFullscreen?: () => void;

  /**
   * Custom UI settings component or element
   * Use this to add more UI settings beyond minimap and flow controls
   */
  customUISettings?: React.ReactNode;

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
 * - UI Settings (minimap, flow controls)
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  canExecute = false,
  isExecuting = false,
  onExecute,
  onSave,
  onLoad,
  onClear,
  onClearExecution,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  showMinimap = true,
  onToggleMinimap,
  showFlowControls = true,
  onToggleFlowControls,
  isFullscreen = false,
  onToggleFullscreen,
  customUISettings,
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
    showClearExecution = false,
    showUndoRedo = false,
    showUISettings = true,
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
  const clearExecutionIcon = renderIcon(icons?.clearExecution, '\ud83d\udd04');
  const undoIcon = renderIcon(icons?.undo, <IoArrowUndo />);
  const redoIcon = renderIcon(icons?.redo, <IoArrowRedo />);
  const minimapIcon = renderIcon(icons?.minimap, <IoMap />);
  const flowControlsIcon = renderIcon(icons?.flowControls, <IoGrid />);
  const fullscreenIcon = renderIcon(
    icons?.fullscreen,
    isFullscreen ? <BiExitFullscreen /> : <BiFullscreen />
  );

  const defaultRootStyle: React.CSSProperties = {
    padding: 'var(--space-4)',
    borderBottom: `1px solid var(--color-border-light)`,
    display: 'flex',
    gap: 'var(--space-3)',
    alignItems: 'center',
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-base)',
    flexShrink: 0,
  };

  const defaultButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-sm)',
    border: `1px solid var(--color-border-medium)`,
    background: 'var(--color-bg-elevated)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    fontFamily: 'var(--font-family-base)',
    transition: 'all var(--transition-fast) var(--ease-out)',
  };

  const defaultDisabledStyle: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
    background: 'var(--color-bg-secondary)',
    color: 'var(--color-text-tertiary)',
    borderColor: 'var(--color-border-light)',
  };

  const defaultActiveStyle: React.CSSProperties = {
    background: 'var(--color-primary-500)',
    color: 'var(--color-text-inverse)',
    borderColor: 'var(--color-primary-500)',
    fontWeight: 'var(--font-weight-semibold)',
  };

  const defaultSectionStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--space-3)',
    alignItems: 'center',
  };

  const defaultDividerStyle: React.CSSProperties = {
    width: '1px',
    height: '24px',
    background: 'var(--color-border-light)',
  };

  return (
    <div
      className={cn(className, classes?.root)}
      style={mergeStyles(defaultRootStyle, styles?.root, style)}
    >
      {/* Left Section - Main Actions */}
      <div style={defaultSectionStyle}>
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
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
              e.currentTarget.style.boxShadow = 'none';
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
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
              e.currentTarget.style.boxShadow = 'none';
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
              e.currentTarget.style.background = 'var(--color-error-500)';
              e.currentTarget.style.borderColor = 'var(--color-error-600)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
              e.currentTarget.style.borderColor = 'var(--color-border-medium)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {clearIcon}
              <span>Clear</span>
            </span>
          </button>
        )}

        {/* Clear Execution Button */}
        {showClearExecution && (
          <button
            onClick={onClearExecution}
            className={classes?.button}
            style={mergeStyles(defaultButtonStyle, styles?.button)}
            title="Clear execution visual state"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-tertiary)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-elevated)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {clearExecutionIcon}
              <span>Clear Execution</span>
            </span>
          </button>
        )}
      </div>

      {showUndoRedo && (
        <>
          <div style={defaultDividerStyle} />

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

      {/* Spacer to push UI settings to the right */}
      <div style={{ flex: 1 }} />

      {/* Right Section - UI Settings */}
      {showUISettings && (
        <div style={{ ...defaultSectionStyle, gap: '1px' }}>
          {/* Minimap Toggle - Icon Only */}
          {onToggleMinimap && (
            <button
              onClick={() => onToggleMinimap(!showMinimap)}
              className={classes?.button}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showMinimap ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-lg)',
                transition: 'color var(--transition-fast) var(--ease-out)',
              }}
              title={showMinimap ? 'Hide minimap' : 'Show minimap'}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = showMinimap
                  ? 'var(--color-primary-700)'
                  : 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = showMinimap
                  ? 'var(--color-primary-600)'
                  : 'var(--color-text-secondary)';
              }}
            >
              {minimapIcon}
            </button>
          )}

          {/* Flow Controls Toggle - Icon Only */}
          {onToggleFlowControls && (
            <button
              onClick={() => onToggleFlowControls(!showFlowControls)}
              className={classes?.button}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showFlowControls
                  ? 'var(--color-primary-600)'
                  : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-lg)',
                transition: 'color var(--transition-fast) var(--ease-out)',
              }}
              title={showFlowControls ? 'Hide controls' : 'Show controls'}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = showFlowControls
                  ? 'var(--color-primary-700)'
                  : 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = showFlowControls
                  ? 'var(--color-primary-600)'
                  : 'var(--color-text-secondary)';
              }}
            >
              {flowControlsIcon}
            </button>
          )}

          {/* Fullscreen Toggle - Icon Only */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={classes?.button}
              style={{
                background: 'none',
                border: 'none',
                padding: 'var(--space-1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFullscreen ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-lg)',
                transition: 'color var(--transition-fast) var(--ease-out)',
              }}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isFullscreen
                  ? 'var(--color-primary-700)'
                  : 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isFullscreen
                  ? 'var(--color-primary-600)'
                  : 'var(--color-text-secondary)';
              }}
            >
              {fullscreenIcon}
            </button>
          )}

          {/* Custom UI Settings */}
          {customUISettings}
        </div>
      )}
    </div>
  );
};
