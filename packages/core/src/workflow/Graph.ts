/**
 * Graph represents the dependency structure of nodes in a workflow.
 * It provides methods for cycle detection and topological sorting.
 */
export class Graph {
  private _nodes: Set<string> = new Set();
  private _edges: Map<string, Set<string>> = new Map();
  private _incomingEdges: Map<string, Set<string>> = new Map();

  /**
   * Add a node to the graph
   */
  addNode(nodeId: string): void {
    this._nodes.add(nodeId);
    if (!this._edges.has(nodeId)) {
      this._edges.set(nodeId, new Set());
    }
    if (!this._incomingEdges.has(nodeId)) {
      this._incomingEdges.set(nodeId, new Set());
    }
  }

  /**
   * Remove a node from the graph
   */
  removeNode(nodeId: string): void {
    this._nodes.delete(nodeId);

    // Remove all outgoing edges
    const outgoing = this._edges.get(nodeId);
    if (outgoing) {
      for (const target of outgoing) {
        const incoming = this._incomingEdges.get(target);
        if (incoming) {
          incoming.delete(nodeId);
        }
      }
    }
    this._edges.delete(nodeId);

    // Remove all incoming edges
    const incoming = this._incomingEdges.get(nodeId);
    if (incoming) {
      for (const source of incoming) {
        const outgoing = this._edges.get(source);
        if (outgoing) {
          outgoing.delete(nodeId);
        }
      }
    }
    this._incomingEdges.delete(nodeId);
  }

  /**
   * Add an edge between two nodes
   */
  addEdge(from: string, to: string): void {
    // Ensure both nodes exist
    this.addNode(from);
    this.addNode(to);

    // Add edge
    const outgoing = this._edges.get(from);
    if (outgoing) {
      outgoing.add(to);
    }

    const incoming = this._incomingEdges.get(to);
    if (incoming) {
      incoming.add(from);
    }
  }

  /**
   * Remove an edge between two nodes
   */
  removeEdge(from: string, to: string): void {
    const outgoing = this._edges.get(from);
    if (outgoing) {
      outgoing.delete(to);
    }

    const incoming = this._incomingEdges.get(to);
    if (incoming) {
      incoming.delete(from);
    }
  }

  /**
   * Check if the graph has cycles
   */
  hasCycles(): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const node of this._nodes) {
      if (!visited.has(node)) {
        if (this.hasCyclesUtil(node, visited, recursionStack)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get topological order of nodes (for execution)
   */
  getTopologicalOrder(): string[] {
    if (this.hasCycles()) {
      throw new Error('Cannot get topological order: graph contains cycles');
    }

    const visited = new Set<string>();
    const stack: string[] = [];

    for (const node of this._nodes) {
      if (!visited.has(node)) {
        this.topologicalSortUtil(node, visited, stack);
      }
    }

    return stack.reverse();
  }

  /**
   * Get all nodes in the graph
   */
  getNodes(): ReadonlySet<string> {
    return new Set(this._nodes);
  }

  /**
   * Get outgoing edges for a node
   */
  getOutgoingEdges(nodeId: string): ReadonlySet<string> {
    return new Set(this._edges.get(nodeId) || []);
  }

  /**
   * Get incoming edges for a node
   */
  getIncomingEdges(nodeId: string): ReadonlySet<string> {
    return new Set(this._incomingEdges.get(nodeId) || []);
  }

  /**
   * Check if there's a path from one node to another
   */
  hasPath(from: string, to: string): boolean {
    if (from === to) {
      return true;
    }

    const visited = new Set<string>();
    const stack = [from];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const outgoing = this._edges.get(current);
      if (outgoing) {
        for (const neighbor of outgoing) {
          if (neighbor === to) {
            return true;
          }
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    }

    return false;
  }

  /**
   * Get nodes with no incoming edges (entry points)
   */
  getEntryNodes(): string[] {
    const entryNodes: string[] = [];
    for (const node of this._nodes) {
      const incoming = this._incomingEdges.get(node);
      if (!incoming || incoming.size === 0) {
        entryNodes.push(node);
      }
    }
    return entryNodes;
  }

  /**
   * Get nodes with no outgoing edges (exit points)
   */
  getExitNodes(): string[] {
    const exitNodes: string[] = [];
    for (const node of this._nodes) {
      const outgoing = this._edges.get(node);
      if (!outgoing || outgoing.size === 0) {
        exitNodes.push(node);
      }
    }
    return exitNodes;
  }

  /**
   * Clear the entire graph
   */
  clear(): void {
    this._nodes.clear();
    this._edges.clear();
    this._incomingEdges.clear();
  }

  /**
   * Utility function for cycle detection using DFS
   */
  private hasCyclesUtil(node: string, visited: Set<string>, recursionStack: Set<string>): boolean {
    visited.add(node);
    recursionStack.add(node);

    const outgoing = this._edges.get(node);
    if (outgoing) {
      for (const neighbor of outgoing) {
        if (!visited.has(neighbor)) {
          if (this.hasCyclesUtil(neighbor, visited, recursionStack)) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          return true; // Back edge found, cycle detected
        }
      }
    }

    recursionStack.delete(node);
    return false;
  }

  /**
   * Utility function for topological sorting using DFS
   */
  private topologicalSortUtil(node: string, visited: Set<string>, stack: string[]): void {
    visited.add(node);

    const outgoing = this._edges.get(node);
    if (outgoing) {
      for (const neighbor of outgoing) {
        if (!visited.has(neighbor)) {
          this.topologicalSortUtil(neighbor, visited, stack);
        }
      }
    }

    stack.push(node);
  }
}
