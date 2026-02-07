import React, { useEffect, memo, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Node as ReactFlowNode,
  Edge,
  ConnectionMode,
  NodeChange,
  EdgeChange,
  Connection,
  useReactFlow,
} from '@xyflow/react';
import { LuRefreshCcw } from 'react-icons/lu';
import { CustomNode } from '../Node/CustomNode';
import {
  ReactFlowCustomization,
  BackgroundCustomProps,
  ControlsCustomProps,
  MiniMapCustomProps,
} from '../../types/styling';
import { mergeStyles } from '../../utils/styling';
import { ReactFlowExecutionState } from '../../hooks/useExecutionVisuals';

// Register CustomNode with React Flow
// IMPORTANT: Define outside component to maintain stable reference across renders
// This prevents React Flow from re-rendering all nodes on every parent update
const nodeTypes = {
  custom: CustomNode,
} as const;

// Inner component to access useReactFlow hook
// IMPORTANT: Defined outside to prevent recreation on every render
const ReactFlowInner: React.FC<{
  onReactFlowInit?: (instance: {
    screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
  }) => void;
  showBackground: boolean;
  showControls: boolean;
  showMiniMap: boolean;
  backgroundProps?: BackgroundCustomProps;
  controlsProps?: ControlsCustomProps;
  miniMapProps?: MiniMapCustomProps;
}> = memo(
  ({
    onReactFlowInit,
    showBackground,
    showControls,
    showMiniMap,
    backgroundProps,
    controlsProps,
    miniMapProps,
  }) => {
    const reactFlowInstance = useReactFlow();

    // Notify parent when React Flow is ready (only once)
    useEffect(() => {
      if (reactFlowInstance && onReactFlowInit) {
        onReactFlowInit({
          screenToFlowPosition: reactFlowInstance.screenToFlowPosition,
        });
      }
      // Only run once when instance is available
    }, [reactFlowInstance]);

    return (
      <>
        {showBackground && (
          <Background
            variant={(backgroundProps?.variant || BackgroundVariant.Dots) as BackgroundVariant}
            gap={backgroundProps?.gap || 20}
            size={backgroundProps?.size || 1.5}
            color={backgroundProps?.color}
            className={backgroundProps?.className}
            style={backgroundProps?.style}
          />
        )}
        {showControls && (
          <Controls
            showZoom={controlsProps?.showZoom}
            showFitView={controlsProps?.showFitView}
            showInteractive={controlsProps?.showInteractive}
            position={controlsProps?.position}
            className={controlsProps?.className}
            style={controlsProps?.style}
          />
        )}
        {showMiniMap && (
          <MiniMap
            nodeColor={
              miniMapProps?.nodeColor ||
              ((node: ReactFlowNode): string => {
                // Extract color from node data if available
                return (node.data?.color as string) || 'var(--color-primary-500)';
              })
            }
            nodeStrokeColor={miniMapProps?.nodeStrokeColor}
            nodeBorderRadius={miniMapProps?.nodeBorderRadius || 4}
            nodeClassName={miniMapProps?.nodeClassName}
            maskColor={miniMapProps?.maskColor}
            position={miniMapProps?.position}
            className={miniMapProps?.className}
            style={miniMapProps?.style}
          />
        )}
      </>
    );
  }
);

export interface WorkflowCanvasProps {
  nodes: ReactFlowNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: ReactFlowNode) => void;
  onPaneClick: () => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onReactFlowInit?: (instance: {
    screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number };
  }) => void;
  onClearExecution?: () => void;

  /**
   * Optional execution visual state (from useExecutionVisuals hook)
   * When provided, nodes and edges will be styled based on execution status
   */
  executionState?: ReactFlowExecutionState;

  /**
   * ReactFlow customization (props for ReactFlow and its sub-components)
   */
  reactFlowCustomization?: ReactFlowCustomization;

  /**
   * Custom className for canvas container
   */
  className?: string;

  /**
   * Custom styles for canvas container
   */
  style?: React.CSSProperties;

  /**
   * React Flow color mode (light, dark, or system)
   */
  colorMode?: 'light' | 'dark' | 'system';
}

/**
 * Pure React Flow canvas component
 * Handles only the visual workflow canvas rendering
 */
export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDrop,
  onDragOver,
  onReactFlowInit,
  onClearExecution,
  executionState,
  reactFlowCustomization,
  className,
  style,
  colorMode = 'light',
}) => {
  const {
    reactFlowProps = {},
    backgroundProps,
    controlsProps,
    miniMapProps,
    showBackground = true,
    showControls = true,
    showMiniMap = true,
  } = reactFlowCustomization || {};

  // Apply execution visual state to nodes
  const enhancedNodes = useMemo(() => {
    if (!executionState) return nodes;

    return nodes.map((node) => {
      const visualData = executionState.nodeVisualData.get(node.id);
      if (!visualData) return node;

      return {
        ...node,
        data: {
          ...node.data,
          executionStatus: visualData.executionStatus,
          executionOutputs: visualData.outputs,
        },
      };
    });
  }, [nodes, executionState]);

  // Apply execution visual state to edges
  const enhancedEdges = useMemo(() => {
    // Always return edges array, never undefined/null
    if (!edges || edges.length === 0) {
      return [];
    }

    // If no execution state, return original edges
    if (!executionState) {
      return edges;
    }

    // Enhance edges with execution state using inline styles (more reliable than CSS classes)
    return edges.map((edge) => {
      const edgeState = executionState.edgeStates.get(edge.id);

      // If no state for this edge, return it unchanged
      if (!edgeState) {
        return edge;
      }

      // Apply execution-specific styles directly
      let style: React.CSSProperties = { ...edge.style };

      if (edgeState.isActive) {
        // Active edge: bright green, thicker stroke
        style = {
          ...style,
          stroke: '#10b981', // green-500
          strokeWidth: 2.5,
        };
      } else if (edgeState.isCompleted) {
        // Completed edge: softer green
        style = {
          ...style,
          stroke: '#22c55e', // green-400
          strokeWidth: 2,
        };
      }

      return {
        ...edge,
        style,
        animated: edgeState.isActive, // React Flow built-in animation
      };
    });
  }, [edges, executionState]);

  const defaultReactFlowProps = useMemo(
    () => ({
      connectionMode: ConnectionMode.Loose,
      fitView: false,
      fitViewOnInit: true,
      proOptions: { hideAttribution: true },
      minZoom: 0.1,
      maxZoom: 4,
      nodeOrigin: [0, 0] as [number, number], // Top-left origin for accurate positioning
      defaultEdgeOptions: {
        type: 'smoothstep',
        animated: false,
      },
    }),
    []
  );

  // Determine if there are cached execution results to show the clear button
  // Only show if execution has completed and there are actual execution results
  const hasExecutionCache =
    executionState &&
    !executionState.isExecuting &&
    executionState.executionProgress.total > 0 &&
    (executionState.nodeVisualData.size > 0 || executionState.edgeStates.size > 0);

  return (
    <div
      className={className}
      style={mergeStyles({ flex: 1, position: 'relative' }, style)}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* Floating Clear Execution Button */}
      {hasExecutionCache && onClearExecution && (
        <button
          onClick={onClearExecution}
          title="Clear execution visual state"
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            zIndex: 5,
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-fast) var(--ease-out)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
          }}
        >
          <LuRefreshCcw />
        </button>
      )}
      <ReactFlow
        nodes={enhancedNodes}
        edges={enhancedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        colorMode={colorMode}
        className={className}
        {...defaultReactFlowProps}
        {...reactFlowProps}
      >
        <ReactFlowInner
          onReactFlowInit={onReactFlowInit}
          showBackground={showBackground}
          showControls={showControls}
          showMiniMap={showMiniMap}
          backgroundProps={backgroundProps}
          controlsProps={controlsProps}
          miniMapProps={miniMapProps}
        />
      </ReactFlow>
    </div>
  );
};
