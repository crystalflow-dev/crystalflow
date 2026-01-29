import 'reflect-metadata';
import { IfNode } from '../../builtin/flow/IfNode';

describe('IfNode', () => {
  let ifNode: IfNode;

  beforeEach(() => {
    ifNode = new IfNode('test-if-node');
  });

  describe('Node Metadata', () => {
    it('should have correct node type', () => {
      const metadata = ifNode.getMetadata();
      expect(metadata.type).toBe('flow.if');
    });

    it('should have correct category', () => {
      const metadata = ifNode.getMetadata();
      expect(metadata.category).toBe('Flow Control');
    });

    it('should have correct label', () => {
      const metadata = ifNode.getMetadata();
      expect(metadata.label).toBe('If');
    });

    it('should have description', () => {
      const metadata = ifNode.getMetadata();
      expect(metadata.description).toContain('Routes execution');
    });
  });

  describe('Input/Output Metadata', () => {
    it('should have condition input', () => {
      const inputs = ifNode.getInputs();
      const conditionInput = inputs.find((i) => i.id === 'condition');
      expect(conditionInput).toBeDefined();
      expect(conditionInput?.type).toBe('boolean');
      expect(conditionInput?.required).toBe(true);
    });

    it('should have value input', () => {
      const inputs = ifNode.getInputs();
      const valueInput = inputs.find((i) => i.id === 'value');
      expect(valueInput).toBeDefined();
      expect(valueInput?.type).toBe('any');
      expect(valueInput?.required).toBe(false);
    });

    it('should have thenOutput', () => {
      const outputs = ifNode.getOutputs();
      const thenOutput = outputs.find((o) => o.id === 'thenOutput');
      expect(thenOutput).toBeDefined();
      expect(thenOutput?.type).toBe('any');
    });

    it('should have elseOutput', () => {
      const outputs = ifNode.getOutputs();
      const elseOutput = outputs.find((o) => o.id === 'elseOutput');
      expect(elseOutput).toBeDefined();
      expect(elseOutput?.type).toBe('any');
    });
  });

  describe('execute() - Condition True', () => {
    it('should set thenOutput when condition is true', () => {
      ifNode.condition = true;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should set thenOutput with value when condition is true', () => {
      ifNode.condition = true;
      ifNode.value = 'test data';
      ifNode.execute();

      expect(ifNode.thenOutput).toBe('test data');
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should pass through object value to thenOutput', () => {
      const data = { userId: 123, name: 'John' };
      ifNode.condition = true;
      ifNode.value = data;
      ifNode.execute();

      expect(ifNode.thenOutput).toBe(data);
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should pass through array value to thenOutput', () => {
      const data = [1, 2, 3];
      ifNode.condition = true;
      ifNode.value = data;
      ifNode.execute();

      expect(ifNode.thenOutput).toBe(data);
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should pass through null value to thenOutput', () => {
      ifNode.condition = true;
      ifNode.value = null;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeNull();
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should pass through zero to thenOutput', () => {
      ifNode.condition = true;
      ifNode.value = 0;
      ifNode.execute();

      expect(ifNode.thenOutput).toBe(0);
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should pass through false boolean to thenOutput', () => {
      ifNode.condition = true;
      ifNode.value = false;
      ifNode.execute();

      expect(ifNode.thenOutput).toBe(false);
      expect(ifNode.elseOutput).toBeUndefined();
    });
  });

  describe('execute() - Condition False', () => {
    it('should set elseOutput when condition is false', () => {
      ifNode.condition = false;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should set elseOutput with value when condition is false', () => {
      ifNode.condition = false;
      ifNode.value = 'test data';
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe('test data');
    });

    it('should pass through object value to elseOutput', () => {
      const data = { userId: 456, name: 'Jane' };
      ifNode.condition = false;
      ifNode.value = data;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe(data);
    });

    it('should pass through array value to elseOutput', () => {
      const data = [4, 5, 6];
      ifNode.condition = false;
      ifNode.value = data;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe(data);
    });

    it('should pass through null value to elseOutput', () => {
      ifNode.condition = false;
      ifNode.value = null;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBeNull();
    });

    it('should pass through zero to elseOutput', () => {
      ifNode.condition = false;
      ifNode.value = 0;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe(0);
    });

    it('should pass through true boolean to elseOutput', () => {
      ifNode.condition = false;
      ifNode.value = true;
      ifNode.execute();

      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe(true);
    });
  });

  describe('evaluateCondition()', () => {
    it('should return "thenOutput" when condition is true', () => {
      ifNode.condition = true;
      expect(ifNode.evaluateCondition()).toBe('thenOutput');
    });

    it('should return "elseOutput" when condition is false', () => {
      ifNode.condition = false;
      expect(ifNode.evaluateCondition()).toBe('elseOutput');
    });

    it('should work before execute() is called', () => {
      ifNode.condition = true;
      expect(ifNode.evaluateCondition()).toBe('thenOutput');
      // execute() not called yet
      expect(ifNode.thenOutput).toBeUndefined();
    });

    it('should work after execute() is called', () => {
      ifNode.condition = false;
      ifNode.value = 'data';
      ifNode.execute();
      expect(ifNode.evaluateCondition()).toBe('elseOutput');
    });
  });

  describe('IConditionalNode Interface', () => {
    it('should implement evaluateCondition method', () => {
      expect(typeof ifNode.evaluateCondition).toBe('function');
    });

    it('should return string from evaluateCondition', () => {
      ifNode.condition = true;
      const result = ifNode.evaluateCondition();
      expect(typeof result).toBe('string');
    });
  });

  describe('Multiple Executions', () => {
    it('should handle multiple executions with changing conditions', () => {
      // First execution - true
      ifNode.condition = true;
      ifNode.value = 'first';
      ifNode.execute();
      expect(ifNode.thenOutput).toBe('first');
      expect(ifNode.elseOutput).toBeUndefined();

      // Second execution - false
      ifNode.condition = false;
      ifNode.value = 'second';
      ifNode.execute();
      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe('second');

      // Third execution - true again
      ifNode.condition = true;
      ifNode.value = 'third';
      ifNode.execute();
      expect(ifNode.thenOutput).toBe('third');
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should clear inactive output on each execution', () => {
      // Set thenOutput
      ifNode.condition = true;
      ifNode.value = 'data1';
      ifNode.execute();
      expect(ifNode.thenOutput).toBe('data1');

      // Switch to else - thenOutput should be cleared
      ifNode.condition = false;
      ifNode.value = 'data2';
      ifNode.execute();
      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBe('data2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      ifNode.condition = true;
      ifNode.value = undefined;
      ifNode.execute();
      expect(ifNode.thenOutput).toBeUndefined();
    });

    it('should handle empty string value', () => {
      ifNode.condition = true;
      ifNode.value = '';
      ifNode.execute();
      expect(ifNode.thenOutput).toBe('');
    });

    it('should handle NaN value', () => {
      ifNode.condition = true;
      ifNode.value = NaN;
      ifNode.execute();
      expect(ifNode.thenOutput).toBeNaN();
    });

    it('should handle complex nested objects', () => {
      const complexData = {
        user: { id: 1, profile: { name: 'Test' } },
        items: [{ id: 1 }, { id: 2 }],
      };
      ifNode.condition = true;
      ifNode.value = complexData;
      ifNode.execute();
      expect(ifNode.thenOutput).toBe(complexData);
    });

    it('should handle function values', () => {
      const fn = () => 'test';
      ifNode.condition = true;
      ifNode.value = fn;
      ifNode.execute();
      expect(ifNode.thenOutput).toBe(fn);
    });
  });

  describe('Default Values', () => {
    it('should have default condition of false', () => {
      expect(ifNode.condition).toBe(false);
    });

    it('should have undefined value by default', () => {
      expect(ifNode.value).toBeUndefined();
    });

    it('should have undefined outputs by default', () => {
      expect(ifNode.thenOutput).toBeUndefined();
      expect(ifNode.elseOutput).toBeUndefined();
    });
  });
});
