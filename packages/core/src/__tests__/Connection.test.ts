import { Connection } from '../workflow/Connection';
import { Node } from '../node/Node';
import { defineNode, Input, Output } from '../node/decorators';
import 'reflect-metadata';

// Test nodes for connection testing
@defineNode({
  autoRegister: false,
  type: 'test.source',
  label: 'Source',
  category: 'Test',
})
class SourceNode extends Node {
  @Output({ type: 'number', label: 'Number Output' })
  numberOutput: number = 42;

  @Output({ type: 'string', label: 'String Output' })
  stringOutput: string = 'hello';

  execute(): void {
    // No execution logic needed for test
  }

  // Override to provide port information for testing
  getOutputPorts() {
    return [
      { name: 'numberOutput', type: 'number', label: 'Number Output' },
      { name: 'stringOutput', type: 'string', label: 'String Output' },
    ];
  }

  getOutputValue(portName: string): unknown {
    return this[portName];
  }
}

@defineNode({
  autoRegister: false,
  type: 'test.target',
  label: 'Target',
  category: 'Test',
})
class TargetNode extends Node {
  @Input({ type: 'number', label: 'Number Input' })
  numberInput: number = 0;

  @Input({ type: 'string', label: 'String Input' })
  stringInput: string = '';

  @Input({ type: 'any', label: 'Any Input' })
  anyInput: unknown = null;

  execute(): void {
    // No execution logic needed for test
  }

  // Override to provide port information for testing
  getInputPorts() {
    return [
      { name: 'numberInput', type: 'number', label: 'Number Input' },
      { name: 'stringInput', type: 'string', label: 'String Input' },
      { name: 'anyInput', type: 'any', label: 'Any Input' },
    ];
  }

  setInputValue(portName: string, value: unknown): void {
    this[portName] = value;
  }
}

describe('Connection', () => {
  let sourceNode: SourceNode;
  let targetNode: TargetNode;

  beforeEach(() => {
    sourceNode = new SourceNode('source-1');
    targetNode = new TargetNode('target-1');
  });

  describe('constructor', () => {
    it('should create a connection with all properties', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput',
        'Test Connection'
      );

      expect(connection.id).toBe('conn-1');
      expect(connection.sourceNodeId).toBe('source-1');
      expect(connection.sourcePort).toBe('numberOutput');
      expect(connection.targetNodeId).toBe('target-1');
      expect(connection.targetPort).toBe('numberInput');
      expect(connection.label).toBe('Test Connection');
    });

    it('should create a connection without label', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput'
      );

      expect(connection.label).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should validate compatible types', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput'
      );

      const result = connection.validate(sourceNode, targetNode);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept any type connections', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'anyInput'
      );

      const result = connection.validate(sourceNode, targetNode);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate type conversions', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'stringInput'
      );

      const result = connection.validate(sourceNode, targetNode);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid source port', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'invalidOutput',
        'target-1',
        'numberInput'
      );

      const result = connection.validate(sourceNode, targetNode);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Source port 'invalidOutput' not found on node source-1",
          }),
        ])
      );
    });

    it('should reject invalid target port', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'invalidInput'
      );

      const result = connection.validate(sourceNode, targetNode);

      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Target port 'invalidInput' not found on node target-1",
          }),
        ])
      );
    });
  });

  describe('transferData', () => {
    it('should transfer data from source to target', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput'
      );

      sourceNode.numberOutput = 100;
      connection.transferData(sourceNode, targetNode);

      expect(targetNode.numberInput).toBe(100);
    });

    it('should transfer string data', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'stringOutput',
        'target-1',
        'stringInput'
      );

      sourceNode.stringOutput = 'test data';
      connection.transferData(sourceNode, targetNode);

      expect(targetNode.stringInput).toBe('test data');
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput',
        'Test Connection'
      );

      const json = connection.toJSON();

      expect(json).toEqual({
        id: 'conn-1',
        source: {
          nodeId: 'source-1',
          portId: 'numberOutput',
        },
        target: {
          nodeId: 'target-1',
          portId: 'numberInput',
        },
      });
    });

    it('should deserialize from JSON', () => {
      const connectionData = {
        id: 'conn-1',
        source: {
          nodeId: 'source-1',
          portId: 'numberOutput',
        },
        target: {
          nodeId: 'target-1',
          portId: 'numberInput',
        },
      };

      const connection = Connection.fromJSON(connectionData);

      expect(connection.id).toBe('conn-1');
      expect(connection.sourceNodeId).toBe('source-1');
      expect(connection.sourcePort).toBe('numberOutput');
      expect(connection.targetNodeId).toBe('target-1');
      expect(connection.targetPort).toBe('numberInput');
    });

    it('should deserialize from JSON without label', () => {
      const connectionData = {
        id: 'conn-1',
        source: {
          nodeId: 'source-1',
          portId: 'numberOutput',
        },
        target: {
          nodeId: 'target-1',
          portId: 'numberInput',
        },
      };

      const connection = Connection.fromJSON(connectionData);

      expect(connection.label).toBeUndefined();
    });
  });

  describe('label property', () => {
    it('should allow setting and getting label', () => {
      const connection = new Connection(
        'conn-1',
        'source-1',
        'numberOutput',
        'target-1',
        'numberInput'
      );

      expect(connection.label).toBeUndefined();

      connection.label = 'New Label';
      expect(connection.label).toBe('New Label');

      connection.label = undefined;
      expect(connection.label).toBeUndefined();
    });
  });
});
