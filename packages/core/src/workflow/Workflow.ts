import { Node } from '../node/Node';
import { NodeRegistry } from '../node/NodeRegistry';
import { Connection } from './Connection';
import {
  WorkflowData,
  NodeData,
  ConnectionData,
  ValidationResult,
  ValidationError,
  ExecutionOptions,
  ExecutionResult,
} from '@crystalflow/types';
import { Executor } from '../execution/Executor';

/**
 * Workflow represents a complete workflow containing nodes and their connections.
 * It provides methods for adding nodes, creating connections, validation, and execution.
 */
export class Workflow {
  private _id: string;
  private _name: string;
  private _version: string = '1.0.0';
  private _nodes: Map<string, Node> = new Map();
  private _connections: Map<string, Connection> = new Map();
  private _metadata: Record<string, unknown> = {};
  private _isValid: boolean = false;
  private _validationErrors: string[] = [];

  constructor(id?: string, name?: string) {
    this._id = id || this.generateId();
    this._name = name || 'Untitled Workflow';
  }

  /**
   * Get workflow ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get workflow name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Set workflow name
   */
  set name(value: string) {
    this._name = value;
  }

  /**
   * Get workflow version
   */
  get version(): string {
    return this._version;
  }

  /**
   * Get all nodes in the workflow
   */
  get nodes(): ReadonlyMap<string, Node> {
    return this._nodes;
  }

  /**
   * Get all connections in the workflow
   */
  get connections(): ReadonlyMap<string, Connection> {
    return this._connections;
  }

  /**
   * Get workflow metadata
   */
  get metadata(): Record<string, unknown> {
    return { ...this._metadata };
  }

  /**
   * Set workflow metadata
   */
  set metadata(value: Record<string, unknown>) {
    this._metadata = { ...value };
  }

  /**
   * Check if workflow is valid
   */
  get isValid(): boolean {
    return this._isValid;
  }

  /**
   * Get validation errors
   */
  get validationErrors(): ReadonlyArray<string> {
    return [...this._validationErrors];
  }

  /**
   * Add a node to the workflow
   */
  addNode(nodeType: string, config?: Partial<NodeData>): Node {
    const registry = NodeRegistry.getInstance();
    const NodeClass = registry.get(nodeType);

    const nodeId = config?.id || this.generateId();
    const node = new NodeClass(nodeId);

    // Set node properties from config
    if (config) {
      if (config.position) {
        node.position = config.position;
      }
      if (config.data) {
        Object.assign(node, config.data);
      }
    }

    this._nodes.set(nodeId, node);
    this.invalidate();

    return node;
  }

  /**
   * Remove a node from the workflow
   */
  removeNode(nodeId: string): boolean {
    const node = this._nodes.get(nodeId);
    if (!node) {
      return false;
    }

    // Remove all connections involving this node
    const connectionsToRemove: string[] = [];
    for (const [connectionId, connection] of this._connections) {
      if (connection.sourceNodeId === nodeId || connection.targetNodeId === nodeId) {
        connectionsToRemove.push(connectionId);
      }
    }

    for (const connectionId of connectionsToRemove) {
      this.removeConnection(connectionId);
    }

    this._nodes.delete(nodeId);
    this.invalidate();

    return true;
  }

  /**
   * Get a node by ID
   */
  getNode(nodeId: string): Node | undefined {
    return this._nodes.get(nodeId);
  }

  /**
   * Create a connection between two nodes
   */
  connect(
    sourceNodeId: string,
    sourcePort: string,
    targetNodeId: string,
    targetPort: string
  ): Connection {
    const sourceNode = this._nodes.get(sourceNodeId);
    const targetNode = this._nodes.get(targetNodeId);

    if (!sourceNode) {
      throw new Error(`Source node '${sourceNodeId}' not found`);
    }
    if (!targetNode) {
      throw new Error(`Target node '${targetNodeId}' not found`);
    }

    const connectionId = this.generateId();
    const connection = new Connection(
      connectionId,
      sourceNodeId,
      sourcePort,
      targetNodeId,
      targetPort
    );

    // Validate connection
    const validationResult = connection.validate(sourceNode, targetNode);
    if (!validationResult.valid) {
      const errorMessages = validationResult.errors.map((e: ValidationError) => e.message);
      throw new Error(`Invalid connection: ${errorMessages.join(', ')}`);
    }

    this._connections.set(connectionId, connection);
    this.invalidate();

    return connection;
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): boolean {
    const connection = this._connections.get(connectionId);
    if (!connection) {
      return false;
    }

    this._connections.delete(connectionId);
    this.invalidate();

    return true;
  }

  /**
   * Get a connection by ID
   */
  getConnection(connectionId: string): Connection | undefined {
    return this._connections.get(connectionId);
  }

  /**
   * Get all connections for a specific node
   */
  getNodeConnections(nodeId: string): Connection[] {
    const connections: Connection[] = [];
    for (const connection of this._connections.values()) {
      if (connection.sourceNodeId === nodeId || connection.targetNodeId === nodeId) {
        connections.push(connection);
      }
    }
    return connections;
  }

  /**
   * Validate the entire workflow
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    // Validate all connections
    for (const connection of this._connections.values()) {
      const sourceNode = this._nodes.get(connection.sourceNodeId);
      const targetNode = this._nodes.get(connection.targetNodeId);

      if (!sourceNode || !targetNode) {
        errors.push(`Connection ${connection.id} references missing nodes`);
        continue;
      }

      const connectionResult = connection.validate(sourceNode, targetNode);
      if (!connectionResult.valid) {
        const errorMessages = connectionResult.errors.map((e: ValidationError) => e.message);
        errors.push(`Connection ${connection.id}: ${errorMessages.join(', ')}`);
      }
    }

    // Validate all nodes (skip if validate method doesn't exist)
    for (const [nodeId] of this._nodes) {
      try {
        // Note: Node validation is optional since the base Node class may not have validate method
        // This will be implemented when the Node class is fully implemented
      } catch (error) {
        console.warn(`Cannot validate node ${nodeId}:`, error);
      }
    }

    this._isValid = errors.length === 0;
    this._validationErrors = errors;

    return {
      valid: this._isValid,
      errors: errors.map((message) => ({
        type: 'workflow' as const,
        message,
      })),
      warnings: [],
    };
  }

  /**
   * Execute the workflow
   * @param options - Execution options (timeout, variables, etc.)
   * @returns Execution result with status, timing, and node results
   */
  async execute(options?: ExecutionOptions): Promise<ExecutionResult> {
    const executor = new Executor();
    return executor.execute(this, options);
  }

  /**
   * Reset all nodes in the workflow
   */
  reset(): void {
    for (const node of this._nodes.values()) {
      if (typeof node.reset === 'function') {
        node.reset();
      }
    }
  }

  /**
   * Export workflow to JSON
   */
  toJSON(): WorkflowData {
    const nodes: NodeData[] = [];
    for (const [nodeId, node] of this._nodes) {
      nodes.push({
        id: nodeId,
        type: node.type,
        position:
          node.position &&
          typeof node.position === 'object' &&
          'x' in node.position &&
          'y' in node.position
            ? (node.position as { x: number; y: number })
            : { x: 0, y: 0 },
        data: node.toJSON ? node.toJSON() : {},
      });
    }

    const connections: ConnectionData[] = [];
    for (const connection of this._connections.values()) {
      connections.push(connection.toJSON());
    }

    return {
      version: this._version,
      id: this._id,
      name: this._name,
      nodes,
      connections,
      metadata: this._metadata,
    };
  }

  /**
   * Import workflow from JSON
   */
  static fromJSON(data: WorkflowData): Workflow {
    const workflow = new Workflow(data.id, data.name);
    workflow._version = data.version;
    workflow._metadata = data.metadata || {};

    const registry = NodeRegistry.getInstance();

    // Add nodes
    for (const nodeData of data.nodes) {
      const NodeClass = registry.get(nodeData.type);
      const node = new NodeClass(nodeData.id);

      // Load node data using fromJSON if available, otherwise use Object.assign
      if (typeof node.fromJSON === 'function' && nodeData.data) {
        node.fromJSON(nodeData.data as Record<string, unknown>);
      } else if (nodeData.data) {
        Object.assign(node, nodeData.data);
      }

      node.position = nodeData.position;

      workflow._nodes.set(nodeData.id, node);
    }

    // Add connections
    for (const connectionData of data.connections) {
      const connection = Connection.fromJSON(connectionData);
      workflow._connections.set(connection.id, connection);
    }

    workflow.validate();
    return workflow;
  }

  /**
   * Transfer data between connected nodes
   */
  private transferNodeData(targetNodeId: string): void {
    for (const connection of this._connections.values()) {
      if (connection.targetNodeId === targetNodeId) {
        const sourceNode = this._nodes.get(connection.sourceNodeId);
        const targetNode = this._nodes.get(connection.targetNodeId);

        if (sourceNode && targetNode) {
          connection.transferData(sourceNode, targetNode);
        }
      }
    }
  }

  /**
   * Invalidate workflow state (mark as needing revalidation)
   */
  private invalidate(): void {
    this._isValid = false;
    this._validationErrors = [];
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
