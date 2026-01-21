import { Node } from '../node/Node';
import { ConnectionData, ValidationResult, ValidationError } from '@reactflo/types';

/**
 * Connection represents a data link between two nodes in a workflow.
 * It handles data transfer and type validation between connected ports.
 */
export class Connection {
  private _id: string;
  private _sourceNodeId: string;
  private _sourcePort: string;
  private _targetNodeId: string;
  private _targetPort: string;
  private _label?: string;

  constructor(
    id: string,
    sourceNodeId: string,
    sourcePort: string,
    targetNodeId: string,
    targetPort: string,
    label?: string
  ) {
    this._id = id;
    this._sourceNodeId = sourceNodeId;
    this._sourcePort = sourcePort;
    this._targetNodeId = targetNodeId;
    this._targetPort = targetPort;
    this._label = label;
  }

  /**
   * Get connection ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get source node ID
   */
  get sourceNodeId(): string {
    return this._sourceNodeId;
  }

  /**
   * Get source port name
   */
  get sourcePort(): string {
    return this._sourcePort;
  }

  /**
   * Get target node ID
   */
  get targetNodeId(): string {
    return this._targetNodeId;
  }

  /**
   * Get target port name
   */
  get targetPort(): string {
    return this._targetPort;
  }

  /**
   * Get connection label
   */
  get label(): string | undefined {
    return this._label;
  }

  /**
   * Set connection label
   */
  set label(value: string | undefined) {
    this._label = value;
  }

  /**
   * Validate this connection between two nodes
   */
  validate(sourceNode: Node, targetNode: Node): ValidationResult {
    const errors: ValidationError[] = [];

    try {
      // Check if source port exists and is an output
      const sourceOutputs = this.getNodeOutputPorts(sourceNode);
      const sourceOutput = sourceOutputs.find((port: any) => port.name === this._sourcePort);

      if (!sourceOutput) {
        errors.push({
          type: 'connection',
          message: `Source port '${this._sourcePort}' not found on node ${this._sourceNodeId}`,
          nodeId: this._sourceNodeId,
          connectionId: this._id,
        });
      }

      // Check if target port exists and is an input
      const targetInputs = this.getNodeInputPorts(targetNode);
      const targetInput = targetInputs.find((port: any) => port.name === this._targetPort);

      if (!targetInput) {
        errors.push({
          type: 'connection',
          message: `Target port '${this._targetPort}' not found on node ${this._targetNodeId}`,
          nodeId: this._targetNodeId,
          connectionId: this._id,
        });
      }

      // Check type compatibility
      if (sourceOutput && targetInput) {
        const isCompatible = this.areTypesCompatible(sourceOutput.type, targetInput.type);
        if (!isCompatible) {
          errors.push({
            type: 'connection',
            message: `Type mismatch: cannot connect ${sourceOutput.type} to ${targetInput.type}`,
            connectionId: this._id,
          });
        }
      }
    } catch (error) {
      // If port introspection fails, we'll allow the connection for now
      console.warn('Connection validation failed:', error);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  /**
   * Transfer data from source node to target node
   */
  transferData(sourceNode: Node, targetNode: Node): void {
    try {
      const sourceValue = this.getNodeOutputValue(sourceNode, this._sourcePort);
      this.setNodeInputValue(targetNode, this._targetPort, sourceValue);
    } catch (error) {
      console.warn(
        `Failed to transfer data from ${this._sourceNodeId} to ${this._targetNodeId}:`,
        error
      );
    }
  }

  /**
   * Get output ports from a node (with fallback)
   */
  private getNodeOutputPorts(node: Node): any[] {
    if (typeof (node as any).getOutputPorts === 'function') {
      return (node as any).getOutputPorts();
    }
    if (typeof (node as any).getOutputs === 'function') {
      return (node as any).getOutputs();
    }
    // Fallback: try to infer from metadata or properties
    return [];
  }

  /**
   * Get input ports from a node (with fallback)
   */
  private getNodeInputPorts(node: Node): any[] {
    if (typeof (node as any).getInputPorts === 'function') {
      return (node as any).getInputPorts();
    }
    if (typeof (node as any).getInputs === 'function') {
      return (node as any).getInputs();
    }
    // Fallback: try to infer from metadata or properties
    return [];
  }

  /**
   * Get output value from a node (with fallback)
   */
  private getNodeOutputValue(node: Node, portName: string): unknown {
    if (typeof (node as any).getOutputValue === 'function') {
      return (node as any).getOutputValue(portName);
    }
    // Fallback: direct property access
    return (node as any)[portName];
  }

  /**
   * Set input value on a node (with fallback)
   */
  private setNodeInputValue(node: Node, portName: string, value: unknown): void {
    if (typeof (node as any).setInputValue === 'function') {
      (node as any).setInputValue(portName, value);
    } else {
      // Fallback: direct property assignment
      (node as any)[portName] = value;
    }
  }

  /**
   * Check if two port types are compatible
   */
  private areTypesCompatible(sourceType: string, targetType: string): boolean {
    // Exact match
    if (sourceType === targetType) {
      return true;
    }

    // Any type accepts anything
    if (targetType === 'any' || sourceType === 'any') {
      return true;
    }

    // Number compatibility
    if (sourceType === 'number' && targetType === 'string') {
      return true; // Numbers can be converted to strings
    }

    // String compatibility
    if (sourceType === 'string' && targetType === 'number') {
      return true; // Strings can be parsed as numbers (with validation)
    }

    // Boolean compatibility
    if (sourceType === 'boolean' && targetType === 'string') {
      return true; // Booleans can be converted to strings
    }

    // Object types (basic compatibility)
    if (sourceType === 'object' && targetType === 'object') {
      return true;
    }

    // Array types (basic compatibility)
    if (sourceType === 'array' && targetType === 'array') {
      return true;
    }

    return false;
  }

  /**
   * Export connection to JSON
   */
  toJSON(): ConnectionData {
    return {
      id: this._id,
      source: {
        nodeId: this._sourceNodeId,
        portId: this._sourcePort,
      },
      target: {
        nodeId: this._targetNodeId,
        portId: this._targetPort,
      },
    };
  }

  /**
   * Import connection from JSON
   */
  static fromJSON(data: ConnectionData): Connection {
    return new Connection(
      data.id,
      data.source.nodeId,
      data.source.portId,
      data.target.nodeId,
      data.target.portId
    );
  }
}
