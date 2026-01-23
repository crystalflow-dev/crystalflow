import React from 'react';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

/**
 * WorkflowBuilder Props
 */
export interface WorkflowBuilderProps {
  /**
   * Array of node classes (decorated with @defineNode)
   */
  nodes?: any[];

  /**
   * Initial workflow data
   */
  initialWorkflow?: any;

  /**
   * Whether to show the JSON editor
   */
  showJsonEditor?: boolean;

  /**
   * Editor mode: visual only, JSON only, or split view
   */
  editorMode?: 'visual' | 'json' | 'split';

  /**
   * JSON editor theme
   */
  jsonEditorTheme?: 'vs-dark' | 'vs-light' | 'hc-black';

  /**
   * Callback when workflow changes
   */
  onWorkflowChange?: (workflow: any) => void;

  /**
   * Callback when execution completes
   */
  onExecute?: (result: any) => void;

  /**
   * Callback when execution fails
   */
  onError?: (error: Error) => void;

  /**
   * Custom styles
   */
  style?: React.CSSProperties;

  /**
   * Custom className
   */
  className?: string;
}

/**
 * Main WorkflowBuilder component
 *
 * This is the primary component that integrates:
 * - React Flow canvas for visual workflow editing
 * - Node palette for drag-and-drop
 * - Property panel for node configuration
 * - JSON editor for code-based editing
 *
 * @example
 * ```tsx
 * <WorkflowBuilder
 *   nodes={[AddNode, MultiplyNode]}
 *   showJsonEditor={true}
 *   editorMode="split"
 *   onWorkflowChange={(workflow) => console.log(workflow)}
 * />
 * ```
 */
export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  // nodes = [],
  // initialWorkflow,
  // showJsonEditor = false,
  // editorMode = 'visual',
  // jsonEditorTheme = 'vs-dark',
  // onWorkflowChange,
  // onExecute,
  // onError,
  style,
  className,
}) => {
  // TODO: Implement WorkflowBuilder logic
  // - Initialize workflow state
  // - Set up React Flow
  // - Add node palette
  // - Add property panel
  // - Integrate JSON editor
  // - Handle execution

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <ReactFlow
        nodes={[]}
        edges={[]}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onConnect={() => {}}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
