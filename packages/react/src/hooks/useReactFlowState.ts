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
} from 'reactflow';

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
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n))
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
