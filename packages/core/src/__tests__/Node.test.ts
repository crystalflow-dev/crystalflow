import 'reflect-metadata';
import { Node } from '../node/Node';
import { defineNode, Input, Output } from '../node/decorators';
import { NodeState } from '@reactflo/types';

// Test node classes
@defineNode({
  autoRegister: false,
  type: 'test.simple',
  label: 'Simple Test Node',
  category: 'Test',
  description: 'A simple test node',
})
class SimpleNode extends Node {
  @Input({ type: 'string', label: 'Input' })
  input: string = '';

  @Output({ type: 'string', label: 'Output' })
  output!: string;

  execute() {
    this.output = this.input.toUpperCase();
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.async',
  label: 'Async Test Node',
  category: 'Test',
})
class AsyncNode extends Node {
  @Input({ type: 'number', label: 'Delay' })
  delay: number = 100;

  @Output({ type: 'string', label: 'Result' })
  result!: string;

  async execute() {
    await new Promise((resolve) => setTimeout(resolve, this.delay));
    this.result = 'completed';
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.error',
  label: 'Error Test Node',
  category: 'Test',
})
class ErrorNode extends Node {
  execute() {
    throw new Error('Test error');
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.required',
  label: 'Required Input Node',
  category: 'Test',
})
class RequiredInputNode extends Node {
  @Input({ type: 'string', label: 'Required Input', required: true })
  requiredInput!: string;

  @Output({ type: 'string', label: 'Output' })
  output!: string;

  execute() {
    this.output = this.requiredInput;
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.default',
  label: 'Default Value Node',
  category: 'Test',
})
class DefaultValueNode extends Node {
  @Input({ type: 'number', label: 'Value', defaultValue: 42 })
  value!: number;

  @Output({ type: 'number', label: 'Result' })
  result!: number;

  execute() {
    this.result = this.value * 2;
  }
}

describe('Node', () => {
  describe('constructor', () => {
    it('should create a node with the given id', () => {
      const node = new SimpleNode('test-id');
      expect(node.id).toBe('test-id');
    });

    it('should set the type from metadata', () => {
      const node = new SimpleNode('test-id');
      expect(node.type).toBe('test.simple');
    });

    it('should initialize state to Idle', () => {
      const node = new SimpleNode('test-id');
      expect(node.state).toBe(NodeState.Idle);
    });

    it('should throw error if @defineNode decorator is missing', () => {
      class InvalidNode extends Node {
        execute() {}
      }

      expect(() => new InvalidNode('test-id')).toThrow(
        'Node InvalidNode is missing @defineNode decorator'
      );
    });
  });

  describe('getMetadata', () => {
    it('should return node metadata', () => {
      const node = new SimpleNode('test-id');
      const metadata = node.getMetadata();

      expect(metadata).toEqual({
        type: 'test.simple',
        label: 'Simple Test Node',
        category: 'Test',
        description: 'A simple test node',
        icon: undefined,
        color: undefined,
        version: undefined,
      });
    });
  });

  describe('getInputs', () => {
    it('should return input port definitions', () => {
      const node = new SimpleNode('test-id');
      const inputs = node.getInputs();

      expect(inputs).toHaveLength(1);
      expect(inputs[0]).toMatchObject({
        id: 'input',
        label: 'Input',
        type: 'string',
      });
    });

    it('should return empty array if no inputs', () => {
      @defineNode({ type: 'test.no-inputs', label: 'No Inputs', category: 'Test' })
      class NoInputsNode extends Node {
        execute() {}
      }

      const node = new NoInputsNode('test-id');
      expect(node.getInputs()).toEqual([]);
    });
  });

  describe('getOutputs', () => {
    it('should return output port definitions', () => {
      const node = new SimpleNode('test-id');
      const outputs = node.getOutputs();

      expect(outputs).toHaveLength(1);
      expect(outputs[0]).toMatchObject({
        id: 'output',
        label: 'Output',
        type: 'string',
      });
    });
  });

  describe('getInput / setInput', () => {
    it('should get and set input values', () => {
      const node = new SimpleNode('test-id');

      node.setInput('input', 'test value');
      expect(node.getInput('input')).toBe('test value');
    });

    it('should apply default values', () => {
      const node = new DefaultValueNode('test-id');
      expect(node.getInput('value')).toBe(42);
    });
  });

  describe('getOutput / setOutput', () => {
    it('should get and set output values', () => {
      const node = new SimpleNode('test-id');

      node.setOutput('output', 'test output');
      expect(node.getOutput('output')).toBe('test output');
    });
  });

  describe('validate', () => {
    it('should pass validation for valid inputs', () => {
      const node = new SimpleNode('test-id');
      node.setInput('input', 'test');

      expect(() => node.validate()).not.toThrow();
    });

    it('should throw error for missing required input', () => {
      const node = new RequiredInputNode('test-id');

      expect(() => node.validate()).toThrow("Required input 'Required Input' is missing");
    });

    it('should pass validation if required input is provided', () => {
      const node = new RequiredInputNode('test-id');
      node.setInput('requiredInput', 'value');

      expect(() => node.validate()).not.toThrow();
    });
  });

  describe('execute', () => {
    it('should execute synchronous node logic', () => {
      const node = new SimpleNode('test-id');
      node.setInput('input', 'hello');

      node.execute();

      expect(node.getOutput('output')).toBe('HELLO');
    });

    it('should execute asynchronous node logic', async () => {
      const node = new AsyncNode('test-id');
      node.setInput('delay', 10);

      await node.execute();

      expect(node.getOutput('result')).toBe('completed');
    });
  });

  describe('run', () => {
    it('should change state to Running during execution', async () => {
      const node = new AsyncNode('test-id');
      node.setInput('delay', 10);

      const runPromise = node.run();
      expect(node.state).toBe(NodeState.Running);

      await runPromise;
    });

    it('should change state to Success after successful execution', async () => {
      const node = new SimpleNode('test-id');
      node.setInput('input', 'test');

      await node.run();

      expect(node.state).toBe(NodeState.Success);
      expect(node.error).toBeUndefined();
    });

    it('should change state to Error on execution failure', async () => {
      const node = new ErrorNode('test-id');

      await expect(node.run()).rejects.toThrow('Test error');
      expect(node.state).toBe(NodeState.Error);
      expect(node.error).toBe('Test error');
    });

    it('should validate inputs before execution', async () => {
      const node = new RequiredInputNode('test-id');

      await expect(node.run()).rejects.toThrow("Required input 'Required Input' is missing");
      expect(node.state).toBe(NodeState.Error);
    });

    it('should clear error on successful run', async () => {
      const node = new ErrorNode('test-id');

      // First run should fail
      await expect(node.run()).rejects.toThrow();
      expect(node.error).toBe('Test error');

      // Override execute to succeed
      node.execute = () => {};
      node.reset();

      // Second run should succeed and clear error
      await node.run();
      expect(node.state).toBe(NodeState.Success);
      expect(node.error).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should reset node state to Idle', async () => {
      const node = new SimpleNode('test-id');
      node.setInput('input', 'test');

      await node.run();
      expect(node.state).toBe(NodeState.Success);

      node.reset();
      expect(node.state).toBe(NodeState.Idle);
    });

    it('should clear error message', async () => {
      const node = new ErrorNode('test-id');

      await expect(node.run()).rejects.toThrow();
      expect(node.error).toBeTruthy();

      node.reset();
      expect(node.error).toBeUndefined();
    });
  });

  describe('toJSON', () => {
    it('should serialize node to JSON', () => {
      const node = new SimpleNode('test-id');
      node.setInput('input', 'test');
      node.setOutput('output', 'TEST');

      const json = node.toJSON();

      expect(json).toEqual({
        id: 'test-id',
        type: 'test.simple',
        state: NodeState.Idle,
        error: undefined,
        data: {
          input: 'test',
          output: 'TEST',
        },
      });
    });

    it('should include error in JSON if present', async () => {
      const node = new ErrorNode('test-id');

      await expect(node.run()).rejects.toThrow();

      const json = node.toJSON();

      expect(json.state).toBe(NodeState.Error);
      expect(json.error).toBe('Test error');
    });

    it('should not include undefined values in data', () => {
      const node = new SimpleNode('test-id');

      const json = node.toJSON();
      const data = json.data as Record<string, unknown>;

      expect(data.input).toBe('');
      expect(data.output).toBeUndefined();
    });
  });

  describe('fromJSON', () => {
    it('should load node state from JSON', () => {
      const node = new SimpleNode('test-id');

      node.fromJSON({
        state: NodeState.Success,
        error: undefined,
        data: {
          input: 'loaded value',
        },
      });

      expect(node.state).toBe(NodeState.Success);
      expect(node.getInput('input')).toBe('loaded value');
    });

    it('should load error from JSON', () => {
      const node = new SimpleNode('test-id');

      node.fromJSON({
        state: NodeState.Error,
        error: 'Previous error',
        data: {},
      });

      expect(node.state).toBe(NodeState.Error);
      expect(node.error).toBe('Previous error');
    });

    it('should only load defined input values', () => {
      const node = new DefaultValueNode('test-id');

      // value has default of 42
      expect(node.getInput('value')).toBe(42);

      node.fromJSON({
        data: {
          value: 100,
        },
      });

      expect(node.getInput('value')).toBe(100);
    });
  });
});
