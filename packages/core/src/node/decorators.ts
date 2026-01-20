import 'reflect-metadata';
import { NodeMetadata, PortDefinition } from '@reactflo/types';

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
 * Class decorator for defining a node type
 *
 * @example
 * ```typescript
 * @defineNode({
 *   type: 'math.add',
 *   label: 'Add Numbers',
 *   category: 'Math'
 * })
 * class AddNode extends Node {
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
