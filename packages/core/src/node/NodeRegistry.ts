import 'reflect-metadata';
import { Node } from './Node';
import { NodeType, NodeDefinition, NodeMetadata } from '@crystalflow/types';

/**
 * Type for a Node constructor
 */
export type NodeConstructor = new (id: string) => Node;

/**
 * Registry for managing node types
 *
 * The NodeRegistry maintains a collection of all available node types
 * and provides methods to register, retrieve, and instantiate nodes.
 *
 * @example
 * ```typescript
 * const registry = NodeRegistry.getInstance();
 *
 * // Register a node type
 * registry.register(AddNode);
 *
 * // Create an instance
 * const node = registry.create('math.add', 'node-1');
 *
 * // Get definition
 * const definition = registry.getDefinition('math.add');
 * ```
 */
export class NodeRegistry {
  private static instance: NodeRegistry;
  private nodes: Map<NodeType, NodeConstructor>;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.nodes = new Map();
  }

  /**
   * Get the singleton instance of the NodeRegistry
   */
  public static getInstance(): NodeRegistry {
    if (!NodeRegistry.instance) {
      NodeRegistry.instance = new NodeRegistry();
    }
    return NodeRegistry.instance;
  }

  /**
   * Register a node type
   *
   * @param nodeClass - The Node class to register
   * @throws Error if the node class is missing metadata or already registered
   *
   * @example
   * ```typescript
   * registry.register(AddNode);
   * ```
   */
  public register(nodeClass: NodeConstructor): void {
    // Get metadata from the class
    const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', nodeClass);

    if (!metadata) {
      throw new Error(`Cannot register ${nodeClass.name}: missing @defineNode decorator`);
    }

    const { type } = metadata;

    // Check if already registered
    if (this.nodes.has(type)) {
      throw new Error(`Node type '${type}' is already registered`);
    }

    // Register the node
    this.nodes.set(type, nodeClass);
  }

  /**
   * Register multiple node types at once
   *
   * @param nodeClasses - Array of Node classes to register
   *
   * @example
   * ```typescript
   * registry.registerAll([AddNode, MultiplyNode, SubtractNode]);
   * ```
   */
  public registerAll(nodeClasses: NodeConstructor[]): void {
    for (const nodeClass of nodeClasses) {
      this.register(nodeClass);
    }
  }

  /**
   * Unregister a node type
   *
   * @param type - The node type to unregister
   * @returns true if the node was unregistered, false if it wasn't registered
   *
   * @example
   * ```typescript
   * registry.unregister('math.add');
   * ```
   */
  public unregister(type: NodeType): boolean {
    return this.nodes.delete(type);
  }

  /**
   * Check if a node type is registered
   *
   * @param type - The node type to check
   * @returns true if the node type is registered
   *
   * @example
   * ```typescript
   * if (registry.has('math.add')) {
   *   // ...
   * }
   * ```
   */
  public has(type: NodeType): boolean {
    return this.nodes.has(type);
  }

  /**
   * Get a node class by type
   *
   * @param type - The node type to retrieve
   * @returns The Node class constructor
   * @throws Error if the node type is not registered
   *
   * @example
   * ```typescript
   * const AddNodeClass = registry.get('math.add');
   * ```
   */
  public get(type: NodeType): NodeConstructor {
    const nodeClass = this.nodes.get(type);

    if (!nodeClass) {
      throw new Error(`Node type '${type}' is not registered`);
    }

    return nodeClass;
  }

  /**
   * Create a new instance of a node
   *
   * @param type - The node type to instantiate
   * @param id - Unique identifier for the node instance
   * @returns A new Node instance
   * @throws Error if the node type is not registered
   *
   * @example
   * ```typescript
   * const addNode = registry.create('math.add', 'node-1');
   * ```
   */
  public create(type: NodeType, id: string): Node {
    const NodeClass = this.get(type);
    return new NodeClass(id);
  }

  /**
   * Get the definition of a node type
   *
   * @param type - The node type to get the definition for
   * @returns The node definition including metadata and port definitions
   * @throws Error if the node type is not registered
   *
   * @example
   * ```typescript
   * const definition = registry.getDefinition('math.add');
   * console.log(definition.metadata.label); // "Add Numbers"
   * ```
   */
  public getDefinition(type: NodeType): NodeDefinition {
    const NodeClass = this.get(type);

    // Create a temporary instance to get metadata
    const tempInstance = new NodeClass('temp');

    return {
      metadata: tempInstance.getMetadata(),
      inputs: tempInstance.getInputs(),
      outputs: tempInstance.getOutputs(),
      properties: tempInstance.getProperties(),
    };
  }

  /**
   * Get all registered node types
   *
   * @returns Array of registered node type identifiers
   *
   * @example
   * ```typescript
   * const types = registry.getTypes();
   * // ['math.add', 'math.multiply', 'http.request', ...]
   * ```
   */
  public getTypes(): NodeType[] {
    return Array.from(this.nodes.keys());
  }

  /**
   * Get all registered node definitions
   *
   * @returns Array of node definitions for all registered types
   *
   * @example
   * ```typescript
   * const definitions = registry.getAllDefinitions();
   * definitions.forEach(def => {
   *   console.log(def.metadata.label);
   * });
   * ```
   */
  public getAllDefinitions(): NodeDefinition[] {
    return this.getTypes().map((type) => this.getDefinition(type));
  }

  /**
   * Get node definitions filtered by category
   *
   * @param category - The category to filter by
   * @returns Array of node definitions in the specified category
   *
   * @example
   * ```typescript
   * const mathNodes = registry.getByCategory('Math');
   * ```
   */
  public getByCategory(category: string): NodeDefinition[] {
    return this.getAllDefinitions().filter((def) => def.metadata.category === category);
  }

  /**
   * Get all unique categories
   *
   * @returns Array of unique category names
   *
   * @example
   * ```typescript
   * const categories = registry.getCategories();
   * // ['Math', 'HTTP', 'String', ...]
   * ```
   */
  public getCategories(): string[] {
    const categories = new Set<string>();

    for (const definition of this.getAllDefinitions()) {
      categories.add(definition.metadata.category);
    }

    return Array.from(categories).sort();
  }

  /**
   * Clear all registered nodes
   * This is primarily useful for testing
   *
   * @example
   * ```typescript
   * registry.clear();
   * ```
   */
  public clear(): void {
    this.nodes.clear();
  }

  /**
   * Get the number of registered node types
   *
   * @returns The count of registered node types
   *
   * @example
   * ```typescript
   * console.log(`${registry.size()} node types registered`);
   * ```
   */
  public size(): number {
    return this.nodes.size;
  }
}
