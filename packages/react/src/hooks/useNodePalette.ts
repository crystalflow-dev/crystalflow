import { useState, useCallback, useMemo } from 'react';
import { Node as ReactFlowNode } from '@xyflow/react';
import { NodeConstructor } from '@reactflo/core';
import { convertNodeToReactFlow, getNodePaletteItems } from '../utils/nodeConverter';

/**
 * Hook for handling drag and drop from node palette
 */
export function useNodePalette(
  nodes: NodeConstructor[],
  screenToFlowPosition?: (position: { x: number; y: number }) => { x: number; y: number }
) {
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

  const onNodeDragStart = useCallback((nodeType: string) => {
    setDraggedNodeType(nodeType);
  }, []);

  const onDrop = useCallback(
    (
      event: React.DragEvent,
      generateNodeId: () => string,
      addNode: (node: ReactFlowNode) => void
    ) => {
      event.preventDefault();

      if (!draggedNodeType) return;

      // Calculate position using screenToFlowPosition if available
      // This properly accounts for pan/zoom state
      let position: { x: number; y: number };

      if (screenToFlowPosition) {
        // Use React Flow's coordinate transformation
        position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
      } else {
        // Fallback to simple bounds calculation (less accurate)
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };
      }

      // Get the node class
      const nodeClass = nodeClassMap.get(draggedNodeType);
      if (!nodeClass) {
        console.error(`Node class not found for type: ${draggedNodeType}`);
        return;
      }

      // Create new node
      const nodeId = generateNodeId();
      const newNode = convertNodeToReactFlow(nodeClass, nodeId, position);

      // Add to canvas
      addNode(newNode);
      setDraggedNodeType(null);
    },
    [draggedNodeType, nodeClassMap, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return {
    paletteItems,
    draggedNodeType,
    onNodeDragStart,
    onDrop,
    onDragOver,
  };
}
