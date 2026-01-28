import React, { useEffect } from 'react';
import { NodeConstructor } from '@reactflo/core';
import { Node as ReactFlowNode, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { WorkflowCanvas } from '../WorkflowCanvas/WorkflowCanvas';
import { NodePalette } from '../NodePalette/NodePalette';
import { PropertyPanel } from '../PropertyPanel/PropertyPanel';
import { Toolbar } from '../Toolbar/Toolbar';
import {
  useReactFlowState,
  useWorkflowExecution,
  useWorkflowFileOperations,
  useNodePalette,
} from '../../hooks';

/**
 * WorkflowBuilder Props
 */
export interface WorkflowBuilderProps {
  /**
   * Array of node classes (decorated with @defineNode)
   */
  nodes?: NodeConstructor[];

  /**
   * Initial workflow data
   */
  initialWorkflow?: unknown;

  /**
   * Whether to show the node palette
   */
  showPalette?: boolean;

  /**
   * Whether to show the property panel
   */
  showProperties?: boolean;

  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;

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
  onWorkflowChange?: (nodes: ReactFlowNode[], edges: Edge[]) => void;

  /**
   * Callback when execution completes
   */
  onExecute?: (result: unknown) => void;

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
 * Orchestrates the workflow editing experience by combining:
 * - React Flow canvas for visual workflow editing
 * - Node palette for drag-and-drop
 * - Property panel for node configuration
 * - Toolbar for workflow actions
 *
 * @example
 * ```tsx
 * <WorkflowBuilder
 *   nodes={[AddNode, MultiplyNode]}
 *   showPalette={true}
 *   showProperties={true}
 *   onWorkflowChange={(nodes, edges) => console.log(nodes, edges)}
 * />
 * ```
 */
export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  nodes = [],
  showPalette = true,
  showProperties = true,
  showToolbar = true,
  onWorkflowChange,
  style,
  className,
}) => {
  // State management hooks
  const reactFlowState = useReactFlowState();
  const { executeWorkflow } = useWorkflowExecution();
  const { saveWorkflow, loadWorkflow } = useWorkflowFileOperations();
  const nodePalette = useNodePalette(nodes);

  // Handle toolbar actions
  const handleSave = () => {
    const result = saveWorkflow(reactFlowState.nodes, reactFlowState.edges);
    if (!result.success) {
      console.error('Save failed:', result.error);
    }
  };

  const handleLoad = async () => {
    const result = await loadWorkflow();
    if (result.success) {
      reactFlowState.loadWorkflow(result.nodes!, result.edges!);
    } else {
      console.error('Load failed:', result.error);
    }
  };

  const handleExecute = async () => {
    try {
      await executeWorkflow(reactFlowState.nodes, reactFlowState.edges);
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    nodePalette.onDrop(event, reactFlowState.generateNodeId, reactFlowState.addNode);
  };

  // Notify parent of changes
  useEffect(() => {
    onWorkflowChange?.(reactFlowState.nodes, reactFlowState.edges);
  }, [reactFlowState.nodes, reactFlowState.edges, onWorkflowChange]);

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', ...style }}
    >
      {/* Toolbar */}
      {showToolbar && (
        <Toolbar
          onClear={reactFlowState.clearWorkflow}
          onSave={handleSave}
          onLoad={handleLoad}
          onExecute={handleExecute}
          canExecute={reactFlowState.nodes.length > 0}
        />
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Node Palette */}
        {showPalette && (
          <NodePalette
            nodes={nodePalette.paletteItems}
            onNodeDragStart={nodePalette.onNodeDragStart}
          />
        )}

        {/* React Flow Canvas */}
        <WorkflowCanvas
          nodes={reactFlowState.nodes}
          edges={reactFlowState.edges}
          onNodesChange={reactFlowState.onNodesChange}
          onEdgesChange={reactFlowState.onEdgesChange}
          onConnect={reactFlowState.onConnect}
          onNodeClick={reactFlowState.onNodeClick}
          onPaneClick={reactFlowState.onPaneClick}
          onDrop={handleDrop}
          onDragOver={nodePalette.onDragOver}
        />

        {/* Property Panel */}
        {showProperties && reactFlowState.selectedNode && (
          <PropertyPanel
            node={reactFlowState.selectedNode}
            onClose={() => reactFlowState.onPaneClick()}
            onUpdate={(updates) => {
              reactFlowState.updateNode(reactFlowState.selectedNode!.id, updates);
            }}
          />
        )}
      </div>
    </div>
  );
};
