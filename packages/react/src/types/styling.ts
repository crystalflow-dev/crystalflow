/**
 * Styling system for ReactFlo components
 *
 * Provides a flexible API for customizing component styles and classnames,
 * similar to popular UI libraries like Material-UI and Chakra UI.
 */

import { ReactFlowProps, BackgroundVariant, Node } from 'reactflow';

/**
 * Base style props that all components support
 */
export interface BaseStyleProps {
  /**
   * Custom CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Class name overrides for WorkflowBuilder sub-components
 */
export interface WorkflowBuilderClasses {
  /**
   * Root container class
   */
  root?: string;

  /**
   * Canvas container class
   */
  canvas?: string;

  /**
   * Node palette class
   */
  palette?: string;

  /**
   * Property panel class
   */
  properties?: string;

  /**
   * Toolbar class
   */
  toolbar?: string;
}

/**
 * Style overrides for WorkflowBuilder sub-components
 */
export interface WorkflowBuilderStyles {
  /**
   * Root container styles
   */
  root?: React.CSSProperties;

  /**
   * Canvas container styles
   */
  canvas?: React.CSSProperties;

  /**
   * Node palette styles
   */
  palette?: React.CSSProperties;

  /**
   * Property panel styles
   */
  properties?: React.CSSProperties;

  /**
   * Toolbar styles
   */
  toolbar?: React.CSSProperties;
}

/**
 * ReactFlow component props that can be customized
 */
export type ReactFlowCustomProps = Partial<
  Pick<
    ReactFlowProps,
    | 'defaultViewport'
    | 'minZoom'
    | 'maxZoom'
    | 'fitView'
    | 'fitViewOptions'
    | 'snapToGrid'
    | 'snapGrid'
    | 'connectionMode'
    | 'connectionLineType'
    | 'connectionLineStyle'
    | 'deleteKeyCode'
    | 'selectionKeyCode'
    | 'multiSelectionKeyCode'
    | 'zoomActivationKeyCode'
    | 'panActivationKeyCode'
    | 'nodesDraggable'
    | 'nodesConnectable'
    | 'elementsSelectable'
    | 'selectNodesOnDrag'
    | 'panOnDrag'
    | 'panOnScroll'
    | 'zoomOnScroll'
    | 'zoomOnPinch'
    | 'zoomOnDoubleClick'
    | 'preventScrolling'
    | 'proOptions'
  >
>;

/**
 * Background component customization
 */
export interface BackgroundCustomProps {
  /**
   * Background variant
   */
  variant?: BackgroundVariant;

  /**
   * Gap between grid elements
   */
  gap?: number;

  /**
   * Size of grid elements
   */
  size?: number;

  /**
   * Color of grid elements
   */
  color?: string;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Controls component customization
 */
export interface ControlsCustomProps {
  /**
   * Show zoom controls
   */
  showZoom?: boolean;

  /**
   * Show fit view control
   */
  showFitView?: boolean;

  /**
   * Show interactive controls
   */
  showInteractive?: boolean;

  /**
   * Controls position
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * MiniMap component customization
 */
export interface MiniMapCustomProps {
  /**
   * Node color function or string
   */
  nodeColor?: string | ((node: Node) => string);

  /**
   * Node stroke color
   */
  nodeStrokeColor?: string;

  /**
   * Node border radius
   */
  nodeBorderRadius?: number;

  /**
   * Node class name
   */
  nodeClassName?: string;

  /**
   * Mask color
   */
  maskColor?: string;

  /**
   * MiniMap position
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /**
   * Custom className
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Complete ReactFlow customization props
 */
export interface ReactFlowCustomization {
  /**
   * ReactFlow component props
   */
  reactFlowProps?: ReactFlowCustomProps;

  /**
   * Background customization
   */
  backgroundProps?: BackgroundCustomProps;

  /**
   * Controls customization
   */
  controlsProps?: ControlsCustomProps;

  /**
   * MiniMap customization
   */
  miniMapProps?: MiniMapCustomProps;

  /**
   * Whether to show Background component
   */
  showBackground?: boolean;

  /**
   * Whether to show Controls component
   */
  showControls?: boolean;

  /**
   * Whether to show MiniMap component
   */
  showMiniMap?: boolean;
}

/**
 * Node palette customization
 */
export interface NodePaletteClasses {
  /**
   * Root container class
   */
  root?: string;

  /**
   * Search input class
   */
  search?: string;

  /**
   * Category header class
   */
  categoryHeader?: string;

  /**
   * Node item class
   */
  nodeItem?: string;

  /**
   * Empty state class
   */
  empty?: string;
}

/**
 * Node palette style overrides
 */
export interface NodePaletteStyles {
  /**
   * Root container styles
   */
  root?: React.CSSProperties;

  /**
   * Search input styles
   */
  search?: React.CSSProperties;

  /**
   * Category header styles
   */
  categoryHeader?: React.CSSProperties;

  /**
   * Node item styles
   */
  nodeItem?: React.CSSProperties;

  /**
   * Empty state styles
   */
  empty?: React.CSSProperties;
}

/**
 * Property panel customization
 */
export interface PropertyPanelClasses {
  /**
   * Root container class
   */
  root?: string;

  /**
   * Header class
   */
  header?: string;

  /**
   * Property group class
   */
  group?: string;

  /**
   * Property label class
   */
  label?: string;

  /**
   * Property input class
   */
  input?: string;

  /**
   * Empty state class
   */
  empty?: string;
}

/**
 * Property panel style overrides
 */
export interface PropertyPanelStyles {
  /**
   * Root container styles
   */
  root?: React.CSSProperties;

  /**
   * Header styles
   */
  header?: React.CSSProperties;

  /**
   * Property group styles
   */
  group?: React.CSSProperties;

  /**
   * Property label styles
   */
  label?: React.CSSProperties;

  /**
   * Property input styles
   */
  input?: React.CSSProperties;

  /**
   * Empty state styles
   */
  empty?: React.CSSProperties;
}

/**
 * Toolbar customization
 */
export interface ToolbarClasses {
  /**
   * Root container class
   */
  root?: string;

  /**
   * Button class
   */
  button?: string;

  /**
   * Button group class
   */
  buttonGroup?: string;

  /**
   * Disabled button class
   */
  buttonDisabled?: string;

  /**
   * Active/executing button class
   */
  buttonActive?: string;
}

/**
 * Toolbar style overrides
 */
export interface ToolbarStyles {
  /**
   * Root container styles
   */
  root?: React.CSSProperties;

  /**
   * Button styles
   */
  button?: React.CSSProperties;

  /**
   * Button group styles
   */
  buttonGroup?: React.CSSProperties;

  /**
   * Disabled button styles
   */
  buttonDisabled?: React.CSSProperties;

  /**
   * Active/executing button styles
   */
  buttonActive?: React.CSSProperties;
}
