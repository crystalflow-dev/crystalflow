import 'reflect-metadata';
import { Node } from '../node/Node';
import { defineNode, Input, Output, discoverNodes, getNodeRegistry } from '../node/decorators';
import { NodeRegistry } from '../node/NodeRegistry';

describe('Node Auto-Discovery', () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    // Create a fresh registry for each test
    registry = NodeRegistry.getInstance();
    // Clear all registered nodes
    registry.clear();
  });

  describe('Manual Registration', () => {
    it('should not auto-register when autoRegister is false', () => {
      @defineNode({
        type: 'test.manual',
        label: 'Manual Node',
        category: 'Test',
        autoRegister: false,
      })
      class _ManualNode extends Node {
        execute() {
          // Empty
        }
      }

      expect(registry.has('test.manual')).toBe(false);
    });

    it('should auto-register by default when autoRegister is omitted', () => {
      @defineNode({
        type: 'test.default',
        label: 'Default Node',
        category: 'Test',
      })
      class _DefaultNode extends Node {
        execute() {
          // Empty
        }
      }

      expect(registry.has('test.default')).toBe(true);
    });

    it('should allow manual registration after decoration', () => {
      @defineNode({
        type: 'test.manual2',
        label: 'Manual Node 2',
        category: 'Test',
        autoRegister: false,
      })
      class ManualNode2 extends Node {
        execute() {
          // Empty
        }
      }

      registry.register(ManualNode2);
      expect(registry.has('test.manual2')).toBe(true);
    });
  });

  describe('Auto-Registration', () => {
    it('should auto-register when autoRegister is true', () => {
      @defineNode({
        type: 'test.auto',
        label: 'Auto Node',
        category: 'Test',
        autoRegister: true,
      })
      class _AutoNode extends Node {
        execute() {
          // Empty
        }
      }

      expect(registry.has('test.auto')).toBe(true);
    });

    it('should auto-register multiple nodes independently', () => {
      @defineNode({
        type: 'test.auto1',
        label: 'Auto Node 1',
        category: 'Test',
        autoRegister: true,
      })
      class _AutoNode1 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.auto2',
        label: 'Auto Node 2',
        category: 'Test',
        autoRegister: true,
      })
      class _AutoNode2 extends Node {
        execute() {
          // Empty
        }
      }

      expect(registry.has('test.auto1')).toBe(true);
      expect(registry.has('test.auto2')).toBe(true);
    });

    it('should handle duplicate auto-registration gracefully', () => {
      @defineNode({
        type: 'test.duplicate',
        label: 'Duplicate Node',
        category: 'Test',
        autoRegister: true,
      })
      class DuplicateNode extends Node {
        execute() {
          // Empty
        }
      }

      // Try to register again (simulating module reload)
      expect(() => {
        registry.register(DuplicateNode);
      }).toThrow();

      // But the node should still be registered from auto-registration
      expect(registry.has('test.duplicate')).toBe(true);
    });

    it('should preserve node metadata with auto-registration', () => {
      @defineNode({
        type: 'test.metadata',
        label: 'Metadata Node',
        category: 'Test',
        description: 'A node with metadata',
        icon: 'icon.svg',
        color: '#FF0000',
        version: '1.0.0',
        autoRegister: true,
      })
      class _MetadataNode extends Node {
        @Input({ type: 'string', label: 'Input' })
        input: string = '';

        @Output({ type: 'string', label: 'Output' })
        output: string = '';

        execute() {
          this.output = this.input;
        }
      }

      const definition = registry.getDefinition('test.metadata');
      expect(definition).toBeDefined();
      expect(definition?.metadata.label).toBe('Metadata Node');
      expect(definition?.metadata.description).toBe('A node with metadata');
      expect(definition?.metadata.icon).toBe('icon.svg');
      expect(definition?.metadata.color).toBe('#FF0000');
      expect(definition?.metadata.version).toBe('1.0.0');
      expect(definition?.inputs).toHaveLength(1);
      expect(definition?.outputs).toHaveLength(1);
    });
  });

  describe('discoverNodes()', () => {
    it('should register multiple nodes at once', () => {
      @defineNode({
        type: 'test.discover1',
        label: 'Discover Node 1',
        category: 'Test',
        autoRegister: false,
      })
      class DiscoverNode1 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.discover2',
        label: 'Discover Node 2',
        category: 'Test',
        autoRegister: false,
      })
      class DiscoverNode2 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.discover3',
        label: 'Discover Node 3',
        category: 'Test',
        autoRegister: false,
      })
      class DiscoverNode3 extends Node {
        execute() {
          // Empty
        }
      }

      discoverNodes([DiscoverNode1, DiscoverNode2, DiscoverNode3]);

      expect(registry.has('test.discover1')).toBe(true);
      expect(registry.has('test.discover2')).toBe(true);
      expect(registry.has('test.discover3')).toBe(true);
    });

    it('should register empty array without errors', () => {
      expect(() => {
        discoverNodes([]);
      }).not.toThrow();
    });

    it('should throw error for nodes without decorators', () => {
      class UndecoratedNode extends Node {
        execute() {
          // Empty
        }
      }

      expect(() => {
        discoverNodes([UndecoratedNode]);
      }).toThrow();
    });
  });

  describe('getNodeRegistry()', () => {
    it('should return the singleton registry instance', () => {
      const reg1 = getNodeRegistry();
      const reg2 = getNodeRegistry();
      const reg3 = NodeRegistry.getInstance();

      expect(reg1).toBe(reg2);
      expect(reg2).toBe(reg3);
    });

    it('should allow advanced registry operations', () => {
      @defineNode({
        type: 'test.advanced',
        label: 'Advanced Node',
        category: 'Test',
        autoRegister: true,
      })
      class _AdvancedNode extends Node {
        execute() {
          // Empty
        }
      }

      const reg = getNodeRegistry();
      const allTypes = reg.getTypes();
      const categories = reg.getCategories();

      expect(allTypes).toContain('test.advanced');
      expect(categories).toContain('Test');
    });
  });

  describe('Hybrid Usage Patterns', () => {
    it('should support mixed auto and manual registration', () => {
      @defineNode({
        type: 'test.hybrid1',
        label: 'Hybrid Node 1',
        category: 'Test',
      })
      class _HybridNode1 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.hybrid2',
        label: 'Hybrid Node 2',
        category: 'Test',
        autoRegister: false,
      })
      class HybridNode2 extends Node {
        execute() {
          // Empty
        }
      }

      registry.register(HybridNode2);

      expect(registry.has('test.hybrid1')).toBe(true);
      expect(registry.has('test.hybrid2')).toBe(true);
    });

    it('should support bulk registration after auto-registration', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @defineNode({
        type: 'test.bulk1',
        label: 'Bulk Node 1',
        category: 'Test',
      })
      class _BulkNode1 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.bulk2',
        label: 'Bulk Node 2',
        category: 'Test',
        autoRegister: false,
      })
      class BulkNode2 extends Node {
        execute() {
          // Empty
        }
      }

      @defineNode({
        type: 'test.bulk3',
        label: 'Bulk Node 3',
        category: 'Test',
        autoRegister: false,
      })
      class BulkNode3 extends Node {
        execute() {
          // Empty
        }
      }

      discoverNodes([BulkNode2, BulkNode3]);

      expect(registry.has('test.bulk1')).toBe(true);
      expect(registry.has('test.bulk2')).toBe(true);
      expect(registry.has('test.bulk3')).toBe(true);
    });

    it('should allow creating instances from discovered nodes', () => {
      @defineNode({
        type: 'test.instance',
        label: 'Instance Node',
        category: 'Test',
        autoRegister: true,
      })
      class InstanceNode extends Node {
        @Input({ type: 'number', label: 'Value' })
        value: number = 0;

        @Output({ type: 'number', label: 'Double' })
        result: number = 0;

        execute() {
          this.result = this.value * 2;
        }
      }

      const node = registry.create('test.instance', 'node-1');
      expect(node).toBeInstanceOf(InstanceNode);
      expect(node.id).toBe('node-1');
      expect(node.type).toBe('test.instance');

      node.value = 5;
      node.execute();
      expect(node.result).toBe(10);
    });
  });
});
