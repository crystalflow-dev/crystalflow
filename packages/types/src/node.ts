/**
 * Node type definitions
 */

/**
 * Unique identifier for a node instance
 */
export type NodeId = string;

/**
 * Node type identifier (e.g., 'math.add', 'http.request')
 */
export type NodeType = string;

/**
 * Node category for organization
 */
export type NodeCategory = string;

/**
 * Position of a node on the canvas
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size dimensions
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Node metadata
 */
export interface NodeMetadata {
  type: NodeType;
  label: string;
  category: NodeCategory;
  description?: string;
  icon?: string;
  color?: string;
  version?: string;
}

/**
 * Port (input or output) definition
 */
export interface PortDefinition {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  defaultValue?: unknown;
  description?: string;
}

/**
 * Node definition
 */
export interface NodeDefinition {
  metadata: NodeMetadata;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
}

/**
 * Node instance data
 */
export interface NodeData {
  id: NodeId;
  type: NodeType;
  position: Position;
  data: Record<string, unknown>;
}

/**
 * Node state
 */
export enum NodeState {
  Idle = 'idle',
  Running = 'running',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}
