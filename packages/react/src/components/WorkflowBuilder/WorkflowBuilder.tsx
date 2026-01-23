import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node as ReactFlowNode,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeConstructor, Workflow } from '@reactflo/core';
import { CustomNode } from '../Node/CustomNode';
import { NodePalette } from '../NodePalette/NodePalette';
import { PropertyPanel } from '../PropertyPanel/PropertyPanel';
import { Toolbar } from '../Toolbar/Toolbar';
import { convertNodeToReactFlow, getNodePaletteItems } from '../../utils/nodeConverter';
import { saveWorkflowToFile, loadWorkflowFromFile } from '../../utils/workflowConverter';

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

// Register CustomNode with React Flow
const nodeTypes = {
  custom: CustomNode,
};

/**
 * Main WorkflowBuilder component
 *
 * This is the primary component that integrates:
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
  // React Flow state
  const [reactFlowNodes, setReactFlowNodes] = useState<ReactFlowNode[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  // Dragging state for node palette
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);

  // Convert registered nodes to palette items
  const paletteItems = useMemo(() => getNodePaletteItems(nodes), [nodes]);

  // Create a map of node type to class for quick lookup
  const nodeClassMap = useMemo(() => {
    const map = new Map<string, NodeConstructor>();
    paletteItems.forEach((item) => {
      map.set(item.type, item.nodeClass);
    });
    return map;
  }, [paletteItems]);

  // Handle node changes (position, selection, etc.)
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setReactFlowNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handle edge changes (selection, deletion, etc.)
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setReactFlowEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Handle new connections
  const onConnect = useCallback((connection: Connection) => {
    setReactFlowEdges((eds) => addEdge(connection, eds));
  }, []);

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: ReactFlowNode) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle drag from palette
  const onNodeDragStart = useCallback((nodeType: string) => {
    setDraggedNodeType(nodeType);
  }, []);

  // Handle drop on canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!draggedNodeType) return;

      // Get the React Flow bounds
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();

      // Calculate position
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Get the node class
      const nodeClass = nodeClassMap.get(draggedNodeType);
      if (!nodeClass) {
        console.error(`Node class not found for type: ${draggedNodeType}`);
        return;
      }

      // Create new node
      const nodeId = `node-${nodeIdCounter}`;
      setNodeIdCounter((c) => c + 1);

      const newNode = convertNodeToReactFlow(nodeClass, nodeId, position);

      // Add to canvas
      setReactFlowNodes((nds) => [...nds, newNode]);
      setDraggedNodeType(null);
    },
    [draggedNodeType, nodeClassMap, nodeIdCounter]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle toolbar actions
  const onClear = useCallback(() => {
    setReactFlowNodes([]);
    setReactFlowEdges([]);
    setSelectedNode(null);
  }, []);

  const onSave = useCallback(() => {
    try {
      saveWorkflowToFile(reactFlowNodes, reactFlowEdges, 'my-workflow');
      console.log('Workflow saved successfully');
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  }, [reactFlowNodes, reactFlowEdges]);

  const onLoad = useCallback(async () => {
    try {
      const { nodes, edges, workflowName } = await loadWorkflowFromFile();
      setReactFlowNodes(nodes);
      setReactFlowEdges(edges);
      setSelectedNode(null);
      console.log(`Workflow "${workflowName}" loaded successfully`);
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  }, []);

  const onExecute = useCallback(async () => {
    try {
      console.log('Executing workflow with nodes:', reactFlowNodes);
      console.log('Edges:', reactFlowEdges);

      // Create a new Workflow instance
      const workflow = new Workflow();

      // Add nodes to workflow
      reactFlowNodes.forEach((rfNode) => {
        const nodeType = rfNode.data.type;
        if (!nodeType) {
          console.error(`Node ${rfNode.id} missing type`);
          return;
        }

        // Add node to workflow using its type string
        const node = workflow.addNode(nodeType, {
          id: rfNode.id,
          position: rfNode.position,
        });

        // Set input values from node data
        if (rfNode.data.inputs) {
          Object.keys(rfNode.data.inputs).forEach((inputKey) => {
            if (rfNode.data[inputKey] !== undefined) {
              node[inputKey] = rfNode.data[inputKey];
            }
          });
        }
      });

      // Add connections
      reactFlowEdges.forEach((edge) => {
        if (edge.source && edge.target && edge.sourceHandle && edge.targetHandle) {
          workflow.connect(edge.source, edge.sourceHandle, edge.target, edge.targetHandle);
        }
      });

      // Execute the workflow
      console.log('Starting workflow execution...');
      const result = await workflow.execute();

      console.log('Workflow execution completed:', result);
      console.log('Node results:', result.nodeResults);

      // Show results
    } catch (error) {
      console.error('Workflow execution failed:', error);
    }
  }, [reactFlowNodes, reactFlowEdges]);

  // Notify parent of changes
  React.useEffect(() => {
    onWorkflowChange?.(reactFlowNodes, reactFlowEdges);
  }, [reactFlowNodes, reactFlowEdges, onWorkflowChange]);

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', ...style }}
    >
      {/* Toolbar */}
      {showToolbar && (
        <Toolbar
          onClear={onClear}
          onSave={onSave}
          onLoad={onLoad}
          onExecute={onExecute}
          canExecute={reactFlowNodes.length > 0}
        />
      )}

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Node Palette */}
        {showPalette && <NodePalette nodes={paletteItems} onNodeDragStart={onNodeDragStart} />}

        {/* React Flow Canvas */}
        <div style={{ flex: 1, position: 'relative' }} onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            connectionMode={ConnectionMode.Loose}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Property Panel */}
        {showProperties && selectedNode && (
          <PropertyPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={(updates) => {
              setReactFlowNodes((nds) =>
                nds.map((n) =>
                  n.id === selectedNode.id ? { ...n, data: { ...n.data, ...updates } } : n
                )
              );
            }}
          />
        )}
      </div>
    </div>
  );
};
