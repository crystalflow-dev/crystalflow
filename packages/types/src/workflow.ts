/**
 * Workflow type definitions
 */

import { NodeId, NodeData } from './node';

/**
 * Connection identifier
 */
export type ConnectionId = string;

/**
 * Workflow identifier
 */
export type WorkflowId = string;

/**
 * Port reference
 */
export interface PortReference {
  nodeId: NodeId;
  portId: string;
}

/**
 * Connection between two nodes
 */
export interface ConnectionData {
  id: ConnectionId;
  source: PortReference;
  target: PortReference;
}

/**
 * Workflow data structure
 */
export interface WorkflowData {
  id: WorkflowId;
  name: string;
  description?: string;
  nodes: NodeData[];
  connections: ConnectionData[];
  version: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Workflow validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error
 */
export interface ValidationError {
  type: 'connection' | 'node' | 'workflow';
  message: string;
  nodeId?: NodeId;
  connectionId?: ConnectionId;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  type: 'connection' | 'node' | 'workflow';
  message: string;
  nodeId?: NodeId;
  connectionId?: ConnectionId;
}
