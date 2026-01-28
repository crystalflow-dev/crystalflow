import React from 'react';
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
} from 'reactflow';
import { CustomNode } from '../Node/CustomNode';
import { ReactFlowCustomization } from '../../types/styling';
import { mergeStyles } from '../../utils/styling';

// Register CustomNode with React Flow
const nodeTypes = {
  custom: CustomNode,
};

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
  reactFlowCustomization,
  className,
  style,
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

  const defaultReactFlowProps = {
    connectionMode: ConnectionMode.Loose,
    fitView: true,
    proOptions: { hideAttribution: true },
  };

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
        {...defaultReactFlowProps}
        {...reactFlowProps}
      >
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
            nodeColor={miniMapProps?.nodeColor}
            nodeStrokeColor={miniMapProps?.nodeStrokeColor}
            nodeBorderRadius={miniMapProps?.nodeBorderRadius}
            nodeClassName={miniMapProps?.nodeClassName}
            maskColor={miniMapProps?.maskColor}
            position={miniMapProps?.position}
            className={miniMapProps?.className}
            style={miniMapProps?.style}
          />
        )}
      </ReactFlow>
    </div>
  );
};
