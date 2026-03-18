/**
 * Utility to convert workflow connections to React Flow edges
 */

import { Edge } from '@xyflow/react';
import { Connection } from '@crystalflow/core';

/**
 * Convert workflow connections to React Flow edges
 *
 * React Flow edge format:
 * - id: unique identifier (we use connection ID)
 * - source: source node ID
 * - target: target node ID
 * - sourceHandle: source port/handle ID
 * - targetHandle: target port/handle ID
 *
 * @param connections - Workflow connections map
 * @returns Array of React Flow edges
 */
export function connectionsToEdges(connections: ReadonlyMap<string, Connection>): Edge[] {
  const edges: Edge[] = [];

  connections.forEach((connection) => {
    edges.push({
      id: connection.id,
      source: connection.sourceNodeId,
      target: connection.targetNodeId,
      sourceHandle: connection.sourcePort,
      targetHandle: connection.targetPort,
      type: 'default',
    });
  });

  return edges;
}

/**
 * Build React Flow edge ID from connection details
 * Format: xy-edge__{sourceNodeId}{sourcePort}-{targetNodeId}{targetPort}
 *
 * @param sourceNodeId - Source node ID
 * @param sourcePort - Source port ID
 * @param targetNodeId - Target node ID
 * @param targetPort - Target port ID
 * @returns React Flow edge ID
 */
export function buildEdgeId(
  sourceNodeId: string,
  sourcePort: string,
  targetNodeId: string,
  targetPort: string
): string {
  return `xy-edge__${sourceNodeId}${sourcePort}-${targetNodeId}${targetPort}`;
}

/**
 * Find connection ID from workflow by matching source/target details
 *
 * @param connections - Workflow connections map
 * @param sourceNodeId - Source node ID
 * @param sourcePort - Source port ID
 * @param targetNodeId - Target node ID
 * @param targetPort - Target port ID
 * @returns Connection ID if found, undefined otherwise
 */
export function findConnectionId(
  connections: ReadonlyMap<string, Connection>,
  sourceNodeId: string,
  sourcePort: string,
  targetNodeId: string,
  targetPort: string
): string | undefined {
  for (const [id, conn] of connections) {
    if (
      conn.sourceNodeId === sourceNodeId &&
      conn.sourcePort === sourcePort &&
      conn.targetNodeId === targetNodeId &&
      conn.targetPort === targetPort
    ) {
      return id;
    }
  }
  return undefined;
}
