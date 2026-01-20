import 'reflect-metadata';
import { NodeRegistry } from '../node/NodeRegistry';
import { Node } from '../node/Node';
import { defineNode, Input, Output } from '../node/decorators';

// Test node classes
@defineNode({
  type: 'math.add',
  label: 'Add Numbers',
  category: 'Math',
  description: 'Adds two numbers',
})
class AddNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute() {
    this.result = this.a + this.b;
  }
}

@defineNode({
  type: 'math.multiply',
  label: 'Multiply Numbers',
  category: 'Math',
})
class MultiplyNode extends Node {
  @Input({ type: 'number', label: 'A' })
  a: number = 0;

  @Input({ type: 'number', label: 'B' })
  b: number = 0;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute() {
    this.result = this.a * this.b;
  }
}

@defineNode({
  type: 'string.upper',
  label: 'To Uppercase',
  category: 'String',
})
class UppercaseNode extends Node {
  @Input({ type: 'string', label: 'Input' })
  input: string = '';

  @Output({ type: 'string', label: 'Output' })
  output!: string;

  execute() {
    this.output = this.input.toUpperCase();
  }
}

describe('NodeRegistry', () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    registry = NodeRegistry.getInstance();
    registry.clear();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = NodeRegistry.getInstance();
      const instance2 = NodeRegistry.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('register', () => {
    it('should register a node type', () => {
      registry.register(AddNode);

      expect(registry.has('math.add')).toBe(true);
    });

    it('should throw error if node is missing @defineNode decorator', () => {
      class InvalidNode extends Node {
        execute() {}
      }

      expect(() => registry.register(InvalidNode)).toThrow(
        'Cannot register InvalidNode: missing @defineNode decorator'
      );
    });

    it('should throw error if node type is already registered', () => {
      registry.register(AddNode);

      expect(() => registry.register(AddNode)).toThrow(
        "Node type 'math.add' is already registered"
      );
    });
  });

  describe('registerAll', () => {
    it('should register multiple node types', () => {
      registry.registerAll([AddNode, MultiplyNode, UppercaseNode]);

      expect(registry.has('math.add')).toBe(true);
      expect(registry.has('math.multiply')).toBe(true);
      expect(registry.has('string.upper')).toBe(true);
    });
  });

  describe('unregister', () => {
    it('should unregister a node type', () => {
      registry.register(AddNode);
      expect(registry.has('math.add')).toBe(true);

      const result = registry.unregister('math.add');

      expect(result).toBe(true);
      expect(registry.has('math.add')).toBe(false);
    });

    it('should return false if node type was not registered', () => {
      const result = registry.unregister('non.existent');

      expect(result).toBe(false);
    });
  });

  describe('has', () => {
    it('should return true for registered node type', () => {
      registry.register(AddNode);

      expect(registry.has('math.add')).toBe(true);
    });

    it('should return false for unregistered node type', () => {
      expect(registry.has('non.existent')).toBe(false);
    });
  });

  describe('get', () => {
    it('should return the node class for a registered type', () => {
      registry.register(AddNode);

      const NodeClass = registry.get('math.add');

      expect(NodeClass).toBe(AddNode);
    });

    it('should throw error for unregistered type', () => {
      expect(() => registry.get('non.existent')).toThrow(
        "Node type 'non.existent' is not registered"
      );
    });
  });

  describe('create', () => {
    it('should create a new instance of a node', () => {
      registry.register(AddNode);

      const node = registry.create('math.add', 'node-1');

      expect(node).toBeInstanceOf(AddNode);
      expect(node.id).toBe('node-1');
      expect(node.type).toBe('math.add');
    });

    it('should throw error for unregistered type', () => {
      expect(() => registry.create('non.existent', 'node-1')).toThrow(
        "Node type 'non.existent' is not registered"
      );
    });

    it('should create multiple instances with different ids', () => {
      registry.register(AddNode);

      const node1 = registry.create('math.add', 'node-1');
      const node2 = registry.create('math.add', 'node-2');

      expect(node1.id).toBe('node-1');
      expect(node2.id).toBe('node-2');
      expect(node1).not.toBe(node2);
    });
  });

  describe('getDefinition', () => {
    it('should return the node definition', () => {
      registry.register(AddNode);

      const definition = registry.getDefinition('math.add');

      expect(definition.metadata).toEqual({
        type: 'math.add',
        label: 'Add Numbers',
        category: 'Math',
        description: 'Adds two numbers',
        icon: undefined,
        color: undefined,
        version: undefined,
      });

      expect(definition.inputs).toHaveLength(2);
      expect(definition.inputs[0]).toMatchObject({
        id: 'a',
        label: 'A',
        type: 'number',
      });

      expect(definition.outputs).toHaveLength(1);
      expect(definition.outputs[0]).toMatchObject({
        id: 'result',
        label: 'Result',
        type: 'number',
      });
    });

    it('should throw error for unregistered type', () => {
      expect(() => registry.getDefinition('non.existent')).toThrow(
        "Node type 'non.existent' is not registered"
      );
    });
  });

  describe('getTypes', () => {
    it('should return all registered node types', () => {
      registry.registerAll([AddNode, MultiplyNode]);

      const types = registry.getTypes();

      expect(types).toEqual(['math.add', 'math.multiply']);
    });

    it('should return empty array if no nodes are registered', () => {
      const types = registry.getTypes();

      expect(types).toEqual([]);
    });
  });

  describe('getAllDefinitions', () => {
    it('should return definitions for all registered nodes', () => {
      registry.registerAll([AddNode, MultiplyNode]);

      const definitions = registry.getAllDefinitions();

      expect(definitions).toHaveLength(2);
      expect(definitions[0].metadata.type).toBe('math.add');
      expect(definitions[1].metadata.type).toBe('math.multiply');
    });

    it('should return empty array if no nodes are registered', () => {
      const definitions = registry.getAllDefinitions();

      expect(definitions).toEqual([]);
    });
  });

  describe('getByCategory', () => {
    it('should return nodes in the specified category', () => {
      registry.registerAll([AddNode, MultiplyNode, UppercaseNode]);

      const mathNodes = registry.getByCategory('Math');

      expect(mathNodes).toHaveLength(2);
      expect(mathNodes[0].metadata.type).toBe('math.add');
      expect(mathNodes[1].metadata.type).toBe('math.multiply');
    });

    it('should return empty array for category with no nodes', () => {
      registry.registerAll([AddNode, MultiplyNode]);

      const httpNodes = registry.getByCategory('HTTP');

      expect(httpNodes).toEqual([]);
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      registry.registerAll([AddNode, MultiplyNode, UppercaseNode]);

      const categories = registry.getCategories();

      expect(categories).toEqual(['Math', 'String']);
    });

    it('should return sorted categories', () => {
      @defineNode({ type: 'z.node', label: 'Z', category: 'Zebra' })
      class ZNode extends Node {
        execute() {}
      }

      @defineNode({ type: 'a.node', label: 'A', category: 'Apple' })
      class ANode extends Node {
        execute() {}
      }

      registry.registerAll([ZNode, ANode]);

      const categories = registry.getCategories();

      expect(categories).toEqual(['Apple', 'Zebra']);
    });

    it('should return empty array if no nodes are registered', () => {
      const categories = registry.getCategories();

      expect(categories).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all registered nodes', () => {
      registry.registerAll([AddNode, MultiplyNode]);

      expect(registry.size()).toBe(2);

      registry.clear();

      expect(registry.size()).toBe(0);
      expect(registry.has('math.add')).toBe(false);
      expect(registry.has('math.multiply')).toBe(false);
    });
  });

  describe('size', () => {
    it('should return the number of registered nodes', () => {
      expect(registry.size()).toBe(0);

      registry.register(AddNode);
      expect(registry.size()).toBe(1);

      registry.register(MultiplyNode);
      expect(registry.size()).toBe(2);

      registry.unregister('math.add');
      expect(registry.size()).toBe(1);
    });
  });
});
