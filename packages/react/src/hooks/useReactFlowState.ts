import { useState, useCallback, useEffect } from 'react';
import {
  Node as ReactFlowNode,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
} from '@xyflow/react';
import { PortDefinition } from '@crystalflow/types';
import { NodeConstructor, Workflow } from '@crystalflow/core';
import { connectionsToEdges } from '../utils/connectionConverter';

/**
 * Hook for managing React Flow state (nodes, edges, selection)
 *
 * Edges are synced between React Flow and workflow:
 * - React Flow manages edge state for UI interactions
 * - Workflow stores connections as source of truth
 * - Changes propagate in both directions
 */
export function useReactFlowState(workflow: Workflow | null, version?: number) {
  const [nodes, setNodes] = useState<ReactFlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<ReactFlowNode | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  // Sync edges from workflow connections whenever workflow changes
  useEffect(() => {
    if (!workflow) {
      setEdges([]);
      return;
    }
    const derivedEdges = connectionsToEdges(workflow.connections);
    setEdges(derivedEdges);
  }, [workflow, version]); // version forces re-sync when workflow mutates

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        // Apply changes to get new node list
        const newNodes = applyNodeChanges(changes, nds);

        // Sync node deletions with workflow
        if (workflow) {
          changes.forEach((change) => {
            if (change.type === 'remove') {
              workflow.removeNode(change.id);
            }
          });
        }

        return newNodes;
      });
    },
    [workflow]
  );

  // Handle edge changes in React Flow (deletions, selections, etc.)
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);

        // Sync edge deletions with workflow
        if (workflow) {
          changes.forEach((change) => {
            if (change.type === 'remove') {
              // Find and remove the connection from workflow
              const connection = Array.from(workflow.connections.values()).find(
                (conn) => conn.id === change.id
              );
              if (connection) {
                workflow.removeConnection(connection.id);
              }
            }
          });
        }

        return newEdges;
      });
    },
    [workflow]
  );

  // onConnect now handled by parent (WorkflowBuilder) which updates workflow
  const onConnect = useCallback((_connection: Connection) => {
    // No-op - parent handles this via workflow.connect()
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
            const tempInstance = new (updatedData.nodeClass as NodeConstructor)(
              `temp-${Date.now()}`
            );

            // Apply all current properties to the instance
            Object.keys(updatedData.properties || {}).forEach((key) => {
              if (updatedData[key] !== undefined) {
                tempInstance[key] = updatedData[key];
              }
            });

            // Check if node has dynamic outputs (getOutputs method)
            if (typeof tempInstance.getOutputs === 'function') {
              const dynamicOutputs = tempInstance.getOutputs();
              // Convert to outputs object
              const outputs: Record<string, PortDefinition> = {};
              dynamicOutputs.forEach((port) => {
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
    // edges are derived from workflow, no need to clear
    setSelectedNode(null);
  }, []);

  const loadWorkflow = useCallback((newNodes: ReactFlowNode[]) => {
    setNodes(newNodes);
    // edges are derived from workflow, no need to load
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
