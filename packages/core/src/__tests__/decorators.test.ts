import 'reflect-metadata';
import { defineNode, Input, Output } from '../node/decorators';
import { Node } from '../node/Node';
import { NodeMetadata, PortDefinition } from '@reactflo/types';

describe('Decorators', () => {
  describe('@defineNode', () => {
    it('should store node metadata on the class', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        execute() {}
      }

      const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', TestNode);

      expect(metadata).toEqual({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
        description: undefined,
        icon: undefined,
        color: undefined,
        version: undefined,
      });
    });

    it('should store optional metadata fields', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
        description: 'A test node',
        icon: 'test-icon',
        color: '#ff0000',
        version: '1.0.0',
      })
      class TestNode extends Node {
        execute() {}
      }

      const metadata: NodeMetadata = Reflect.getMetadata('node:metadata', TestNode);

      expect(metadata).toEqual({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
        description: 'A test node',
        icon: 'test-icon',
        color: '#ff0000',
        version: '1.0.0',
      });
    });

    it('should not affect the class constructor', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        execute() {}
      }

      const instance = new TestNode('test-id');

      expect(instance).toBeInstanceOf(TestNode);
      expect(instance).toBeInstanceOf(Node);
    });
  });

  describe('@Input', () => {
    it('should store input port definition', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({ type: 'string', label: 'Input Port' })
        inputPort!: string;

        execute() {}
      }

      const inputs: PortDefinition[] = Reflect.getMetadata('node:inputs', TestNode);

      expect(inputs).toHaveLength(1);
      expect(inputs[0]).toEqual({
        id: 'inputPort',
        label: 'Input Port',
        type: 'string',
        required: undefined,
        defaultValue: undefined,
        description: undefined,
      });
    });

    it('should use property name as label if not provided', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({ type: 'number' })
        myInput!: number;

        execute() {}
      }

      const inputs: PortDefinition[] = Reflect.getMetadata('node:inputs', TestNode);

      expect(inputs[0].label).toBe('myInput');
    });

    it('should store multiple input ports', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({ type: 'string', label: 'Input 1' })
        input1!: string;

        @Input({ type: 'number', label: 'Input 2' })
        input2!: number;

        @Input({ type: 'boolean', label: 'Input 3' })
        input3!: boolean;

        execute() {}
      }

      const inputs: PortDefinition[] = Reflect.getMetadata('node:inputs', TestNode);

      expect(inputs).toHaveLength(3);
      expect(inputs[0].id).toBe('input1');
      expect(inputs[1].id).toBe('input2');
      expect(inputs[2].id).toBe('input3');
    });

    it('should store optional fields', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({
          type: 'string',
          label: 'Input',
          required: true,
          defaultValue: 'default',
          description: 'An input port',
        })
        input!: string;

        execute() {}
      }

      const inputs: PortDefinition[] = Reflect.getMetadata('node:inputs', TestNode);

      expect(inputs[0]).toEqual({
        id: 'input',
        label: 'Input',
        type: 'string',
        required: true,
        defaultValue: 'default',
        description: 'An input port',
      });
    });

    it('should set default value on the property', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({ type: 'number', defaultValue: 42 })
        value!: number;

        execute() {}
      }

      const instance = new TestNode('test-id');

      expect(instance.value).toBe(42);
    });

    it('should not set property value if no default is provided', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Input({ type: 'string' })
        value!: string;

        execute() {}
      }

      const instance = new TestNode('test-id');

      expect(instance.value).toBeUndefined();
    });
  });

  describe('@Output', () => {
    it('should store output port definition', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Output({ type: 'string', label: 'Output Port' })
        outputPort!: string;

        execute() {}
      }

      const outputs: PortDefinition[] = Reflect.getMetadata('node:outputs', TestNode);

      expect(outputs).toHaveLength(1);
      expect(outputs[0]).toEqual({
        id: 'outputPort',
        label: 'Output Port',
        type: 'string',
        description: undefined,
      });
    });

    it('should use property name as label if not provided', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Output({ type: 'number' })
        myOutput!: number;

        execute() {}
      }

      const outputs: PortDefinition[] = Reflect.getMetadata('node:outputs', TestNode);

      expect(outputs[0].label).toBe('myOutput');
    });

    it('should store multiple output ports', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Output({ type: 'string', label: 'Output 1' })
        output1!: string;

        @Output({ type: 'number', label: 'Output 2' })
        output2!: number;

        execute() {}
      }

      const outputs: PortDefinition[] = Reflect.getMetadata('node:outputs', TestNode);

      expect(outputs).toHaveLength(2);
      expect(outputs[0].id).toBe('output1');
      expect(outputs[1].id).toBe('output2');
    });

    it('should store description if provided', () => {
      @defineNode({
        type: 'test.node',
        label: 'Test Node',
        category: 'Test',
      })
      class TestNode extends Node {
        @Output({
          type: 'string',
          label: 'Output',
          description: 'An output port',
        })
        output!: string;

        execute() {}
      }

      const outputs: PortDefinition[] = Reflect.getMetadata('node:outputs', TestNode);

      expect(outputs[0].description).toBe('An output port');
    });
  });

  describe('Combined decorators', () => {
    it('should work with all decorators together', () => {
      @defineNode({
        type: 'test.complete',
        label: 'Complete Node',
        category: 'Test',
        description: 'A complete test node',
      })
      class CompleteNode extends Node {
        @Input({ type: 'string', label: 'Input 1' })
        input1!: string;

        @Input({ type: 'number', label: 'Input 2', defaultValue: 0 })
        input2!: number;

        @Output({ type: 'string', label: 'Output 1' })
        output1!: string;

        @Output({ type: 'number', label: 'Output 2' })
        output2!: number;

        execute() {
          this.output1 = this.input1 + String(this.input2);
          this.output2 = this.input2 * 2;
        }
      }

      const instance = new CompleteNode('test-id');
      const metadata = instance.getMetadata();
      const inputs = instance.getInputs();
      const outputs = instance.getOutputs();

      expect(metadata.type).toBe('test.complete');
      expect(inputs).toHaveLength(2);
      expect(outputs).toHaveLength(2);
      expect(instance.input2).toBe(0);
    });

    it('should preserve decorator order', () => {
      @defineNode({
        type: 'test.order',
        label: 'Order Test',
        category: 'Test',
      })
      class OrderNode extends Node {
        @Input({ type: 'string', label: 'First' })
        first!: string;

        @Input({ type: 'string', label: 'Second' })
        second!: string;

        @Input({ type: 'string', label: 'Third' })
        third!: string;

        execute() {}
      }

      const instance = new OrderNode('test-id');
      const inputs = instance.getInputs();

      expect(inputs[0].label).toBe('First');
      expect(inputs[1].label).toBe('Second');
      expect(inputs[2].label).toBe('Third');
    });

    it('should handle inheritance', () => {
      @defineNode({
        type: 'test.base',
        label: 'Base Node',
        category: 'Test',
      })
      class BaseNode extends Node {
        @Input({ type: 'string', label: 'Base Input' })
        baseInput!: string;

        @Output({ type: 'string', label: 'Base Output' })
        baseOutput!: string;

        execute() {}
      }

      @defineNode({
        type: 'test.child',
        label: 'Child Node',
        category: 'Test',
      })
      class ChildNode extends BaseNode {
        @Input({ type: 'number', label: 'Child Input' })
        childInput!: number;

        @Output({ type: 'number', label: 'Child Output' })
        childOutput!: number;

        execute() {}
      }

      const instance = new ChildNode('test-id');

      // Child has its own metadata
      expect(instance.getMetadata().type).toBe('test.child');

      // Child inherits parent inputs/outputs and adds its own
      const inputs = instance.getInputs();
      const outputs = instance.getOutputs();

      expect(inputs).toHaveLength(2);
      expect(inputs[0].label).toBe('Base Input');
      expect(inputs[1].label).toBe('Child Input');
      expect(outputs).toHaveLength(2);
      expect(outputs[0].label).toBe('Base Output');
      expect(outputs[1].label).toBe('Child Output');
    });
  });
});
