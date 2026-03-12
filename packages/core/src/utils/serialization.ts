/**
 * Workflow serialization utilities
 */

import { WorkflowData } from '@crystalflow/types';

/**
 * Serializes a workflow to JSON string
 */
export function serializeWorkflow(workflow: WorkflowData): string {
  return JSON.stringify(workflow, null, 2);
}

/**
 * Deserializes a workflow from JSON string
 */
export function deserializeWorkflow(json: string): WorkflowData {
  const data = JSON.parse(json);

  // Validate version
  if (!data.version) {
    throw new Error('Missing workflow version');
  }

  // Validate required fields
  if (!data.id || !data.name || !data.nodes || !data.connections) {
    throw new Error('Invalid workflow format: missing required fields');
  }

  return data as WorkflowData;
}

/**
 * Validates a workflow JSON structure
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateWorkflowJSON(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Type guard for object
  if (typeof data !== 'object' || data === null) {
    errors.push('Workflow data must be an object');
    return { valid: false, errors, warnings };
  }

  const workflow = data as Record<string, unknown>;

  // Check required fields
  if (!workflow.version) errors.push('Missing required field: version');
  if (!workflow.id) errors.push('Missing required field: id');
  if (!workflow.name) errors.push('Missing required field: name');
  if (!workflow.nodes) errors.push('Missing required field: nodes');
  if (!workflow.connections) errors.push('Missing required field: connections');

  // Check types
  if (workflow.nodes && !Array.isArray(workflow.nodes)) {
    errors.push('Field "nodes" must be an array');
  }
  if (workflow.connections && !Array.isArray(workflow.connections)) {
    errors.push('Field "connections" must be an array');
  }

  // Validate nodes
  if (Array.isArray(workflow.nodes)) {
    workflow.nodes.forEach((node: unknown, index: number) => {
      const n = node as Record<string, unknown>;
      if (!n.id) errors.push(`Node at index ${index} missing required field: id`);
      if (!n.type) errors.push(`Node at index ${index} missing required field: type`);
      if (!n.position) errors.push(`Node at index ${index} missing required field: position`);
      if (!n.data) errors.push(`Node at index ${index} missing required field: data`);
    });
  }

  // Validate connections
  if (Array.isArray(workflow.connections)) {
    workflow.connections.forEach((conn: unknown, index: number) => {
      const c = conn as Record<string, unknown>;
      if (!c.id) errors.push(`Connection at index ${index} missing required field: id`);
      if (!c.source) errors.push(`Connection at index ${index} missing required field: source`);
      if (!c.target) errors.push(`Connection at index ${index} missing required field: target`);

      const source = c.source as Record<string, unknown> | undefined;
      const target = c.target as Record<string, unknown> | undefined;

      if (source && (!source.nodeId || !source.portId)) {
        errors.push(`Connection at index ${index} has invalid source reference`);
      }
      if (target && (!target.nodeId || !target.portId)) {
        errors.push(`Connection at index ${index} has invalid target reference`);
      }
    });
  }

  // Check for orphaned connections
  if (Array.isArray(workflow.nodes) && Array.isArray(workflow.connections)) {
    const nodeIds = new Set(workflow.nodes.map((n: unknown) => (n as Record<string, unknown>).id));
    workflow.connections.forEach((conn: unknown, index: number) => {
      const c = conn as Record<string, unknown>;
      const source = c.source as Record<string, unknown> | undefined;
      const target = c.target as Record<string, unknown> | undefined;

      if (source && !nodeIds.has(source.nodeId)) {
        errors.push(
          `Connection at index ${index} references non-existent source node: ${source.nodeId}`
        );
      }
      if (target && !nodeIds.has(target.nodeId)) {
        errors.push(
          `Connection at index ${index} references non-existent target node: ${target.nodeId}`
        );
      }
    });
  }

  // Warnings
  if (!workflow.description) warnings.push('Consider adding a description');
  if (!workflow.metadata) warnings.push('Consider adding metadata (author, timestamps, tags)');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Migrates workflow from one version to another
 */
export function migrateWorkflow(data: unknown, targetVersion: string): WorkflowData {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid workflow data: must be an object');
  }

  const workflow = data as Record<string, unknown>;
  const currentVersion = workflow.version || '1.0.0';

  if (currentVersion === targetVersion) {
    return data as WorkflowData;
  }

  // Migration logic will be added as versions evolve
  throw new Error(`Migration from ${currentVersion} to ${targetVersion} not yet implemented`);
}
