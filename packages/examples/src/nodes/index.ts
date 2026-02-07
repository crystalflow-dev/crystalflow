/**
 * Example nodes for CrystalFlow demos
 */

// Input nodes
export { NumberInputNode } from './input/NumberInputNode';
export { StringInputNode } from './input/StringInputNode';

// Math nodes
export { AddNode } from './math/AddNode';
export { MultiplyNode } from './math/MultiplyNode';
export { SubtractNode } from './math/SubtractNode';
export { ModuloNode } from './math/ModuloNode';

// Logic nodes
export * from './logic';

// Output nodes
export { DisplayNode } from './output/DisplayNode';

// Data nodes
export { MockAPINode } from './data/MockAPINode';
export { ExtractFieldNode } from './data/ExtractFieldNode';
export { FormatTextNode } from './data/FormatTextNode';

// Async nodes (for testing execution visualization)
export * from './async';

// Automation nodes (n8n-style)
export * from './automation';

// Demo nodes
export { ConfigDemoNode } from './ConfigDemoNode';
