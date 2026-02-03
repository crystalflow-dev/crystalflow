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
import { CustomNode } from '../Node/CustomNode';
import {
  ReactFlowCustomization,
  BackgroundCustomProps,
  ControlsCustomProps,
  MiniMapCustomProps,
} from '../../types/styling';
import { mergeStyles } from '../../utils/styling';

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

  const defaultReactFlowProps = useMemo(
    () => ({
      connectionMode: ConnectionMode.Loose,
      fitView: false,
      fitViewOnInit: true,
      proOptions: { hideAttribution: true },
      minZoom: 0.1,
      maxZoom: 4,
      nodeOrigin: [0.5, 0.5] as [number, number], // Center origin for better drag performance
      defaultEdgeOptions: {
        type: 'smoothstep',
        animated: false,
      },
    }),
    []
  );

  return (
    <div
      className={className}
      style={mergeStyles({ flex: 1, position: 'relative' }, style)}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
