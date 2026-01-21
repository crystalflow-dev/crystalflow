import { Graph } from '../workflow/Graph';

describe('Graph', () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  describe('addNode', () => {
    it('should add a node to the graph', () => {
      graph.addNode('node1');

      expect(graph.getNodes().has('node1')).toBe(true);
      expect(graph.getOutgoingEdges('node1').size).toBe(0);
      expect(graph.getIncomingEdges('node1').size).toBe(0);
    });

    it('should handle adding the same node multiple times', () => {
      graph.addNode('node1');
      graph.addNode('node1');

      expect(graph.getNodes().size).toBe(1);
    });
  });

  describe('removeNode', () => {
    it('should remove a node and its edges', () => {
      graph.addNode('node1');
      graph.addNode('node2');
      graph.addNode('node3');

      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');

      graph.removeNode('node2');

      expect(graph.getNodes().has('node2')).toBe(false);
      expect(graph.getOutgoingEdges('node1').size).toBe(0);
      expect(graph.getIncomingEdges('node3').size).toBe(0);
    });

    it('should handle removing non-existent node', () => {
      expect(() => graph.removeNode('non-existent')).not.toThrow();
    });
  });

  describe('addEdge', () => {
    it('should add an edge between two nodes', () => {
      graph.addEdge('node1', 'node2');

      expect(graph.getNodes().has('node1')).toBe(true);
      expect(graph.getNodes().has('node2')).toBe(true);
      expect(graph.getOutgoingEdges('node1').has('node2')).toBe(true);
      expect(graph.getIncomingEdges('node2').has('node1')).toBe(true);
    });

    it('should handle multiple edges from same node', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node1', 'node3');

      expect(graph.getOutgoingEdges('node1').size).toBe(2);
      expect(graph.getOutgoingEdges('node1').has('node2')).toBe(true);
      expect(graph.getOutgoingEdges('node1').has('node3')).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('should remove an edge between two nodes', () => {
      graph.addEdge('node1', 'node2');
      expect(graph.getOutgoingEdges('node1').has('node2')).toBe(true);

      graph.removeEdge('node1', 'node2');
      expect(graph.getOutgoingEdges('node1').has('node2')).toBe(false);
      expect(graph.getIncomingEdges('node2').has('node1')).toBe(false);
    });

    it('should handle removing non-existent edge', () => {
      expect(() => graph.removeEdge('node1', 'node2')).not.toThrow();
    });
  });

  describe('hasCycles', () => {
    it('should detect no cycles in acyclic graph', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');
      graph.addEdge('node1', 'node3');

      expect(graph.hasCycles()).toBe(false);
    });

    it('should detect cycles in cyclic graph', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');
      graph.addEdge('node3', 'node1');

      expect(graph.hasCycles()).toBe(true);
    });

    it('should detect self-loop as cycle', () => {
      graph.addEdge('node1', 'node1');

      expect(graph.hasCycles()).toBe(true);
    });

    it('should return false for empty graph', () => {
      expect(graph.hasCycles()).toBe(false);
    });

    it('should return false for single node', () => {
      graph.addNode('node1');

      expect(graph.hasCycles()).toBe(false);
    });
  });

  describe('getTopologicalOrder', () => {
    it('should return correct topological order', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');
      graph.addEdge('node1', 'node3');

      const order = graph.getTopologicalOrder();

      expect(order).toEqual(['node1', 'node2', 'node3']);
    });

    it('should handle multiple valid orderings', () => {
      graph.addEdge('node1', 'node3');
      graph.addEdge('node2', 'node3');

      const order = graph.getTopologicalOrder();

      // Both 'node1, node2, node3' and 'node2, node1, node3' are valid
      expect(order[2]).toBe('node3'); // node3 should be last
      expect(order.slice(0, 2).sort()).toEqual(['node1', 'node2']);
    });

    it('should throw error for cyclic graph', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node1');

      expect(() => graph.getTopologicalOrder()).toThrow(
        'Cannot get topological order: graph contains cycles'
      );
    });

    it('should return empty array for empty graph', () => {
      expect(graph.getTopologicalOrder()).toEqual([]);
    });

    it('should return single node for single node graph', () => {
      graph.addNode('node1');

      expect(graph.getTopologicalOrder()).toEqual(['node1']);
    });
  });

  describe('hasPath', () => {
    it('should find direct path', () => {
      graph.addEdge('node1', 'node2');

      expect(graph.hasPath('node1', 'node2')).toBe(true);
      expect(graph.hasPath('node2', 'node1')).toBe(false);
    });

    it('should find indirect path', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');

      expect(graph.hasPath('node1', 'node3')).toBe(true);
      expect(graph.hasPath('node3', 'node1')).toBe(false);
    });

    it('should return true for same node', () => {
      graph.addNode('node1');

      expect(graph.hasPath('node1', 'node1')).toBe(true);
    });

    it('should return false for disconnected nodes', () => {
      graph.addNode('node1');
      graph.addNode('node2');

      expect(graph.hasPath('node1', 'node2')).toBe(false);
    });
  });

  describe('getEntryNodes', () => {
    it('should return nodes with no incoming edges', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node1', 'node3');
      graph.addEdge('node2', 'node4');

      const entryNodes = graph.getEntryNodes();

      expect(entryNodes).toEqual(['node1']);
    });

    it('should return multiple entry nodes', () => {
      graph.addEdge('node1', 'node3');
      graph.addEdge('node2', 'node3');

      const entryNodes = graph.getEntryNodes().sort();

      expect(entryNodes).toEqual(['node1', 'node2']);
    });

    it('should return all nodes when no edges exist', () => {
      graph.addNode('node1');
      graph.addNode('node2');

      const entryNodes = graph.getEntryNodes().sort();

      expect(entryNodes).toEqual(['node1', 'node2']);
    });
  });

  describe('getExitNodes', () => {
    it('should return nodes with no outgoing edges', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node3', 'node2');
      graph.addEdge('node1', 'node4');

      const exitNodes = graph.getExitNodes().sort();

      expect(exitNodes).toEqual(['node2', 'node4']);
    });

    it('should return single exit node', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');

      const exitNodes = graph.getExitNodes();

      expect(exitNodes).toEqual(['node3']);
    });
  });

  describe('clear', () => {
    it('should clear all nodes and edges', () => {
      graph.addEdge('node1', 'node2');
      graph.addEdge('node2', 'node3');

      expect(graph.getNodes().size).toBe(3);

      graph.clear();

      expect(graph.getNodes().size).toBe(0);
      expect(graph.getEntryNodes()).toEqual([]);
      expect(graph.getExitNodes()).toEqual([]);
    });
  });
});
