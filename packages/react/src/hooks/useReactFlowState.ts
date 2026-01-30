import { useState, useCallback } from 'react';
import {
  Node as ReactFlowNode,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
} from '@xyflow/react';

/**
 * Hook for managing React Flow state (nodes, edges, selection)
 */
export function useReactFlowState() {
  const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: ReactFlowNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((node: ReactFlowNode) => {
    setNodes((nds) => [...nds, node]);
    setNodeIdCounter((c) => c + 1);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;

        const updatedData = { ...n.data, ...updates };

        // If the node has a nodeClass with getOutputs(), recalculate dynamic outputs
        if (updatedData.nodeClass && typeof updatedData.nodeClass === 'function') {
          try {
            // Create a temporary instance with updated properties
            const tempInstance = new (updatedData.nodeClass as any)(`temp-${Date.now()}`);

            // Apply all current properties to the instance
            Object.keys(updatedData.properties || {}).forEach((key) => {
              if (updatedData[key] !== undefined) {
                tempInstance[key] = updatedData[key];
              }
            });

            // Check if node has dynamic outputs (getOutputs method)
            if (typeof tempInstance.getOutputs === 'function') {
              const dynamicOutputs = tempInstance.getOutputs();
              console.log('Recalculated dynamic outputs:', dynamicOutputs);

              // Convert to outputs object
              const outputs: Record<string, any> = {};
              dynamicOutputs.forEach((port: any) => {
                outputs[port.id] = port;
              });

              updatedData.outputs = outputs;
            }
          } catch (error) {
            console.warn('Failed to recalculate dynamic outputs:', error);
          }
        }

        return { ...n, data: updatedData };
      })
    );
  }, []);

  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, []);

  const loadWorkflow = useCallback((newNodes: ReactFlowNode[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedNode(null);
  }, []);

  const generateNodeId = useCallback(() => {
    const id = `node-${nodeIdCounter}`;
    setNodeIdCounter((c) => c + 1);
    return id;
  }, [nodeIdCounter]);

  return {
    // State
    nodes,
    edges,
    selectedNode,

    // Event handlers
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,

    // Actions
    addNode,
    updateNode,
    clearWorkflow,
    loadWorkflow,
    generateNodeId,
  };
}
