import 'reflect-metadata';
import { NodeMetadata, PortDefinition, PropertyDefinition } from '@crystalflow/types';
import { NodeRegistry, NodeConstructor } from './NodeRegistry';

/**
 * Options for defining a node
 */
export interface DefineNodeOptions {
  /** Unique type identifier (e.g., 'math.add', 'http.request') */
  type: string;
  /** Human-readable label */
  label: string;
  /** Category for organization */
  category: string;
  /** Optional description of what the node does */
  description?: string;
  /** Optional icon name or URL */
  icon?: string;
  /** Optional color for the node */
  color?: string;
  /** Optional version string */
  version?: string;
  /** Whether to automatically register this node with the NodeRegistry (default: true) */
  autoRegister?: boolean;
}

/**
 * Options for defining an input port
 */
export interface InputOptions {
  /** Port type (string, number, boolean, etc.) */
  type: string;
  /** Human-readable label */
  label?: string;
  /** Whether this input is required */
  required?: boolean;
  /** Default value for the input */
  defaultValue?: unknown;
  /** Optional description */
  description?: string;
}

/**
 * Options for defining an output port
 */
export interface OutputOptions {
  /** Port type (string, number, boolean, etc.) */
  type: string;
  /** Human-readable label */
  label?: string;
  /** Optional description */
  description?: string;
}

/**
 * Options for defining a node property
 */
export interface PropertyOptions {
  /** Property type (string, number, boolean, select, etc.) */
  type: string;
  /** Human-readable label */
  label?: string;
  /** Default value for the property */
  defaultValue?: unknown;
  /** Optional description */
  description?: string;
  /** Options for select/enum types */
  options?: Array<{ value: string; label: string }>;
  /** Min/max values for numeric types */
  min?: number;
  max?: number;
  /** Step value for numeric types */
  step?: number;
  /** Whether this property is required */
  required?: boolean;
}

/**
 * Class decorator for defining a node type
 *
 * @example
 * ```typescript
 * // Auto-registration (default)
 * @defineNode({
 *   type: 'math.add',
 *   label: 'Add Numbers',
 *   category: 'Math'
 * })
 * class AddNode extends Node {
 *   // ...
 * }
 *
 * // Manual registration (explicit opt-out)
 * @defineNode({
 *   type: 'math.multiply',
 *   label: 'Multiply Numbers',
 *   category: 'Math',
 *   autoRegister: false
 * })
 * class MultiplyNode extends Node {
 *   // ...
 * }
 * ```
 */
export function defineNode(options: DefineNodeOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    // Store metadata on the constructor
    const metadata: NodeMetadata = {
      type: options.type,
      label: options.label,
      category: options.category,
      description: options.description,
      icon: options.icon,
      color: options.color,
      version: options.version,
    };

    Reflect.defineMetadata('node:metadata', metadata, constructor);

    // Auto-register by default unless explicitly disabled
    if (options.autoRegister !== false) {
      try {
        const registry = NodeRegistry.getInstance();
        registry.register(constructor as NodeConstructor);
      } catch (error) {
        // Silently ignore registration errors (e.g., duplicate registration)
        // This allows hot reloading and re-importing modules without errors
        console.warn(`Failed to auto-register node '${options.type}':`, error);
      }
    }

    return constructor;
  };
}

/**
 * Property decorator for defining an input port
 *
 * @example
 * ```typescript
 * class MyNode extends Node {
 *   @Input({ type: 'number', label: 'Input Value', required: true })
 *   inputValue: number = 0;
 * }
 * ```
 */
export function Input(options: InputOptions): PropertyDecorator {
  return function (target: unknown, propertyKey: string | symbol): void {
    if (!target || typeof target !== 'object') return;

    const key = String(propertyKey);
    // Get existing inputs or create new array
    const inputs: PortDefinition[] =
      Reflect.getMetadata('node:inputs', (target as object).constructor) || [];

    // Add this input to the list
    const portDefinition: PortDefinition = {
      id: key,
      label: options.label || key,
      type: options.type,
      required: options.required,
      defaultValue: options.defaultValue,
      description: options.description,
    };

    inputs.push(portDefinition);

    // Store updated inputs
    Reflect.defineMetadata('node:inputs', inputs, (target as object).constructor);

    // Set default value if provided
    if (options.defaultValue !== undefined) {
      (target as Record<string, unknown>)[key] = options.defaultValue;
    }
  } as PropertyDecorator;
}

/**
 * Property decorator for defining an output port
 *
 * @example
 * ```typescript
 * class MyNode extends Node {
 *   @Output({ type: 'string', label: 'Result' })
 *   result: string;
 * }
 * ```
 */
export function Output(options: OutputOptions): PropertyDecorator {
  return function (target: unknown, propertyKey: string | symbol): void {
    if (!target || typeof target !== 'object') return;

    const key = String(propertyKey);
    // Get existing outputs or create new array
    const outputs: PortDefinition[] =
      Reflect.getMetadata('node:outputs', (target as object).constructor) || [];

    // Add this output to the list
    const portDefinition: PortDefinition = {
      id: key,
      label: options.label || key,
      type: options.type,
      description: options.description,
    };

    outputs.push(portDefinition);

    // Store updated outputs
    Reflect.defineMetadata('node:outputs', outputs, (target as object).constructor);
  } as PropertyDecorator;
}

/**
 * Property decorator for defining a node property
 *
 * Properties are configuration values that can be set in the UI properties panel
 * but are not part of the workflow's data flow (not inputs or outputs).
 *
 * @example
 * ```typescript
 * class MyNode extends Node {
 *   @Property({ type: 'string', label: 'API Endpoint', defaultValue: 'https://api.example.com' })
 *   endpoint: string = 'https://api.example.com';
 *
 *   @Property({
 *     type: 'select',
 *     label: 'Method',
 *     defaultValue: 'GET',
 *     options: [
 *       { value: 'GET', label: 'GET' },
 *       { value: 'POST', label: 'POST' }
 *     ]
 *   })
 *   method: string = 'GET';
 *
 *   @Property({ type: 'number', label: 'Timeout (ms)', defaultValue: 5000, min: 1000, max: 30000 })
 *   timeout: number = 5000;
 * }
 * ```
 */
export function Property(options: PropertyOptions): PropertyDecorator {
  return function (target: unknown, propertyKey: string | symbol): void {
    if (!target || typeof target !== 'object') return;

    const key = String(propertyKey);
    // Get existing properties or create new array
    const properties: PropertyDefinition[] =
      Reflect.getMetadata('node:properties', (target as object).constructor) || [];

    // Add this property to the list
    const propertyDefinition: PropertyDefinition = {
      id: key,
      label: options.label || key,
      type: options.type,
      defaultValue: options.defaultValue,
      description: options.description,
      options: options.options,
      min: options.min,
      max: options.max,
      step: options.step,
      required: options.required,
    };

    properties.push(propertyDefinition);

    // Store updated properties
    Reflect.defineMetadata('node:properties', properties, (target as object).constructor);

    // Set default value if provided
    if (options.defaultValue !== undefined) {
      (target as Record<string, unknown>)[key] = options.defaultValue;
    }
  } as PropertyDecorator;
}

/**
 * Discover and register multiple node types at once
 *
 * This utility function provides a convenient way to register multiple nodes
 * in a single call, making it easy to set up your node library.
 *
 * @param nodeClasses - Array of Node classes to register
 *
 * @example
 * ```typescript
 * import { AddNode, MultiplyNode, SubtractNode } from './nodes';
 *
 * // Register all nodes at once
 * discoverNodes([AddNode, MultiplyNode, SubtractNode]);
 * ```
 *
 * @example
 * ```typescript
 * // Register nodes from multiple modules
 * import * as MathNodes from './nodes/math';
 * import * as StringNodes from './nodes/string';
 *
 * discoverNodes([
 *   ...Object.values(MathNodes),
 *   ...Object.values(StringNodes),
 * ]);
 * ```
 */
export function discoverNodes(nodeClasses: NodeConstructor[]): void {
  const registry = NodeRegistry.getInstance();
  registry.registerAll(nodeClasses);
}

/**
 * Get the current node registry instance
 *
 * This provides direct access to the NodeRegistry singleton for advanced use cases.
 *
 * @returns The NodeRegistry singleton instance
 *
 * @example
 * ```typescript
 * const registry = getNodeRegistry();
 * const allTypes = registry.getAllTypes();
 * console.log('Registered node types:', allTypes);
 * ```
 */
export function getNodeRegistry(): NodeRegistry {
  return NodeRegistry.getInstance();
}
