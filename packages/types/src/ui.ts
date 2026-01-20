/**
 * UI-related type definitions
 */

import { NodeId, Position, Size } from './node';
import { ConnectionId } from './workflow';

/**
 * Canvas viewport
 */
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

/**
 * Selection state
 */
export interface SelectionState {
  nodes: Set<NodeId>;
  connections: Set<ConnectionId>;
}

/**
 * Canvas bounds
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Node bounds including position and size
 */
export interface NodeBounds extends Position, Size {}

/**
 * Drag state
 */
export interface DragState {
  isDragging: boolean;
  draggedNodes: Set<NodeId>;
  startPosition?: Position;
  offset?: Position;
}

/**
 * Connection being drawn
 */
export interface PendingConnection {
  sourceNodeId: NodeId;
  sourcePortId: string;
  targetPosition?: Position;
}

/**
 * Theme configuration
 */
export interface Theme {
  colors: {
    background: string;
    grid: string;
    node: {
      background: string;
      border: string;
      text: string;
      selected: string;
    };
    connection: {
      stroke: string;
      strokeSelected: string;
    };
    port: {
      fill: string;
      stroke: string;
    };
  };
  spacing: {
    node: {
      padding: number;
      borderRadius: number;
    };
    port: {
      size: number;
      spacing: number;
    };
  };
}
