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
 * Property definition for node configuration
 */
export interface PropertyDefinition {
  id: string;
  label: string;
  type: string;
  defaultValue?: unknown;
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
 * Node definition
 */
export interface NodeDefinition {
  metadata: NodeMetadata;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  properties: PropertyDefinition[];
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

// ============================================================================
// Control Flow Node Interfaces
// ============================================================================

/**
 * Interface for conditional nodes that support branching execution
 *
 * Conditional nodes enable workflows to make runtime decisions and execute
 * different branches based on conditions. Examples include if/else nodes,
 * switch/case nodes, and custom conditional logic nodes.
 *
 * During execution, the PlanExecutor will:
 * 1. Execute the conditional node normally (via execute() method)
 * 2. Call evaluateCondition() to determine which branch to take
 * 3. Execute only the steps in the selected branch
 * 4. Skip all other branches
 *
 * @example
 * ```typescript
 * @defineNode({
 *   type: 'flow.if',
 *   label: 'If/Else',
 *   category: 'Flow Control'
 * })
 * export class IfNode extends Node implements IConditionalNode {
 *   @Input({ type: 'boolean', label: 'Condition', required: true })
 *   condition: boolean = false;
 *
 *   @Output({ type: 'any', label: 'Then' })
 *   thenOutput: any;
 *
 *   @Output({ type: 'any', label: 'Else' })
 *   elseOutput: any;
 *
 *   execute(): void {
 *     // Node execution logic
 *   }
 *
 *   evaluateCondition(): string {
 *     return this.condition ? 'thenOutput' : 'elseOutput';
 *   }
 * }
 * ```
 *
 * @see ConditionalStep in execution.ts for execution plan representation
 */
export interface IConditionalNode {
  /**
   * Evaluate the condition and return the name of the output port
   * that represents the active branch to execute.
   *
   * This method is called after the node's execute() method has run,
   * allowing the node to use its computed state to make the decision.
   *
   * @returns The ID/name of the output port corresponding to the branch to execute.
   *          Must match one of the node's defined output port IDs.
   *
   * @example
   * ```typescript
   * // For an IfNode:
   * evaluateCondition(): string {
   *   return this.condition ? 'thenOutput' : 'elseOutput';
   * }
   *
   * // For a SwitchNode:
   * evaluateCondition(): string {
   *   const matchIndex = this.cases.findIndex(c => c === this.value);
   *   return matchIndex >= 0 ? `case${matchIndex}Output` : 'defaultOutput';
   * }
   * ```
   */
  evaluateCondition(): string;
}
