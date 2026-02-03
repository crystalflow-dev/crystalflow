import 'reflect-metadata';
import { SwitchNode } from '../../builtin/flow/SwitchNode';

describe('SwitchNode', () => {
  let switchNode: SwitchNode;

  beforeEach(() => {
    switchNode = new SwitchNode('test-switch-node');
  });

  describe('Node Metadata', () => {
    it('should have correct node type', () => {
      const metadata = switchNode.getMetadata();
      expect(metadata.type).toBe('flow.switch');
    });

    it('should have correct category', () => {
      const metadata = switchNode.getMetadata();
      expect(metadata.category).toBe('Flow Control');
    });

    it('should have correct label', () => {
      const metadata = switchNode.getMetadata();
      expect(metadata.label).toBe('Switch');
    });

    it('should have description', () => {
      const metadata = switchNode.getMetadata();
      expect(metadata.description).toContain('Routes execution');
    });
  });

  describe('Input/Output Metadata', () => {
    it('should have value input', () => {
      const inputs = switchNode.getInputs();
      const valueInput = inputs.find((i) => i.id === 'value');
      expect(valueInput).toBeDefined();
      expect(valueInput?.type).toBe('any');
      expect(valueInput?.required).toBe(true);
    });

    it('should have cases property', () => {
      const properties = switchNode.getProperties();
      const casesProperty = properties.find((p) => p.id === 'cases');
      expect(casesProperty).toBeDefined();
      expect(casesProperty?.type).toBe('array');
      expect(casesProperty?.defaultValue).toEqual([]);
    });

    it('should have data input', () => {
      const inputs = switchNode.getInputs();
      const dataInput = inputs.find((i) => i.id === 'data');
      expect(dataInput).toBeDefined();
      expect(dataInput?.type).toBe('any');
      expect(dataInput?.required).toBe(false);
    });

    it('should generate outputs dynamically based on cases array', () => {
      switchNode.cases = ['a', 'b', 'c'];
      const outputs = switchNode.getOutputs();

      expect(outputs).toHaveLength(4); // 3 cases + 1 default
      expect(outputs[0].id).toBe('case_0');
      expect(outputs[1].id).toBe('case_1');
      expect(outputs[2].id).toBe('case_2');
      expect(outputs[3].id).toBe('default');
    });

    it('should generate 2 outputs for 1 case', () => {
      switchNode.cases = ['single'];
      const outputs = switchNode.getOutputs();

      expect(outputs).toHaveLength(2); // 1 case + 1 default
      expect(outputs[0].id).toBe('case_0');
      expect(outputs[1].id).toBe('default');
    });

    it('should generate many outputs for many cases', () => {
      switchNode.cases = Array(20)
        .fill(0)
        .map((_, i) => i);
      const outputs = switchNode.getOutputs();

      expect(outputs).toHaveLength(21); // 20 cases + 1 default
      expect(outputs[0].id).toBe('case_0');
      expect(outputs[19].id).toBe('case_19');
      expect(outputs[20].id).toBe('default');
    });

    it('should always have default output', () => {
      switchNode.cases = [];
      const outputs = switchNode.getOutputs();

      expect(outputs).toHaveLength(1);
      expect(outputs[0].id).toBe('default');
    });
  });

  describe('execute() - Case Matching', () => {
    it('should set case_0 output when value matches first case', () => {
      switchNode.value = 'apple';
      switchNode.cases = ['apple', 'orange', 'banana'];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should set case_1 output when value matches second case', () => {
      switchNode.value = 'orange';
      switchNode.cases = ['apple', 'orange', 'banana'];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.case_2).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should set case_2 output when value matches third case', () => {
      switchNode.value = 'banana';
      switchNode.cases = ['apple', 'orange', 'banana'];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.case_2).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should work with more than 5 cases', () => {
      switchNode.value = 'item10';
      switchNode.cases = Array(15)
        .fill(0)
        .map((_, i) => `item${i}`);
      switchNode.execute();

      expect(switchNode.case_10).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should set default output when no case matches', () => {
      switchNode.value = 'grape';
      switchNode.cases = ['apple', 'orange', 'banana'];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.case_2).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should set default output when cases array is empty', () => {
      switchNode.value = 'anything';
      switchNode.cases = [];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });
  });

  describe('execute() - Data Passthrough', () => {
    it('should pass data through to case_0 output', () => {
      switchNode.value = 'apple';
      switchNode.cases = ['apple', 'orange'];
      switchNode.data = { count: 5 };
      switchNode.execute();

      expect(switchNode.case_0).toEqual({ count: 5 });
      expect(switchNode.case_1).toBeUndefined();
    });

    it('should pass data through to case_1 output', () => {
      switchNode.value = 'orange';
      switchNode.cases = ['apple', 'orange'];
      switchNode.data = { count: 10 };
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toEqual({ count: 10 });
    });

    it('should pass data through to default output', () => {
      switchNode.value = 'grape';
      switchNode.cases = ['apple', 'orange'];
      switchNode.data = { count: 15 };
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.default).toEqual({ count: 15 });
    });

    it('should pass string data through', () => {
      switchNode.value = 1;
      switchNode.cases = [1, 2, 3];
      switchNode.data = 'test string';
      switchNode.execute();

      expect(switchNode.case_0).toBe('test string');
    });

    it('should pass array data through', () => {
      switchNode.value = 'b';
      switchNode.cases = ['a', 'b', 'c'];
      switchNode.data = [1, 2, 3];
      switchNode.execute();

      expect(switchNode.case_1).toEqual([1, 2, 3]);
    });

    it('should pass null through', () => {
      switchNode.value = 'test';
      switchNode.cases = ['test'];
      switchNode.data = null;
      switchNode.execute();

      expect(switchNode.case_0).toBeNull();
    });

    it('should pass zero through', () => {
      switchNode.value = 'x';
      switchNode.cases = ['x'];
      switchNode.data = 0;
      switchNode.execute();

      expect(switchNode.case_0).toBe(0);
    });

    it('should pass false through', () => {
      switchNode.value = 'y';
      switchNode.cases = ['y'];
      switchNode.data = false;
      switchNode.execute();

      expect(switchNode.case_0).toBe(false);
    });
  });

  describe('execute() - Type Matching', () => {
    it('should match number values with strict equality', () => {
      switchNode.value = 42;
      switchNode.cases = [1, 42, 100];
      switchNode.execute();

      expect(switchNode.case_1).toBeUndefined();
    });

    it('should not match number with string', () => {
      switchNode.value = '42';
      switchNode.cases = [1, 42, 100];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });

    it('should match boolean values', () => {
      switchNode.value = true;
      switchNode.cases = [false, true];
      switchNode.execute();

      expect(switchNode.case_1).toBeUndefined();
    });

    it('should match null', () => {
      switchNode.value = null;
      switchNode.cases = [undefined, null, 0];
      switchNode.execute();

      expect(switchNode.case_1).toBeUndefined();
    });

    it('should match undefined', () => {
      switchNode.value = undefined;
      switchNode.cases = [null, undefined, 0];
      switchNode.execute();

      expect(switchNode.case_1).toBeUndefined();
    });

    it('should distinguish between null and undefined', () => {
      switchNode.value = null;
      switchNode.cases = [undefined];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });
  });

  describe('evaluateCondition()', () => {
    it('should return "case_0" for first case match', () => {
      switchNode.value = 'a';
      switchNode.cases = ['a', 'b', 'c'];
      expect(switchNode.evaluateCondition()).toBe('case_0');
    });

    it('should return "case_1" for second case match', () => {
      switchNode.value = 'b';
      switchNode.cases = ['a', 'b', 'c'];
      expect(switchNode.evaluateCondition()).toBe('case_1');
    });

    it('should return "case_2" for third case match', () => {
      switchNode.value = 'c';
      switchNode.cases = ['a', 'b', 'c'];
      expect(switchNode.evaluateCondition()).toBe('case_2');
    });

    it('should return "case_10" for 11th case match', () => {
      switchNode.value = 'k';
      switchNode.cases = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
      expect(switchNode.evaluateCondition()).toBe('case_10');
    });

    it('should work with many cases', () => {
      switchNode.value = 'item50';
      switchNode.cases = Array(100)
        .fill(0)
        .map((_, i) => `item${i}`);
      expect(switchNode.evaluateCondition()).toBe('case_50');
    });

    it('should return "default" when no match', () => {
      switchNode.value = 'z';
      switchNode.cases = ['a', 'b', 'c'];
      expect(switchNode.evaluateCondition()).toBe('default');
    });

    it('should return "default" when cases is empty', () => {
      switchNode.value = 'anything';
      switchNode.cases = [];
      expect(switchNode.evaluateCondition()).toBe('default');
    });

    it('should work before execute() is called', () => {
      switchNode.value = 'test';
      switchNode.cases = ['test'];
      expect(switchNode.evaluateCondition()).toBe('case_0');
      expect(switchNode.case_0).toBeUndefined();
    });

    it('should work after execute() is called', () => {
      switchNode.value = 'test';
      switchNode.cases = ['other', 'test'];
      switchNode.data = 'data';
      switchNode.execute();
      expect(switchNode.evaluateCondition()).toBe('case_1');
      expect(switchNode.case_1).toBe('data');
    });
  });

  describe('IConditionalNode Interface', () => {
    it('should implement evaluateCondition method', () => {
      expect(typeof switchNode.evaluateCondition).toBe('function');
    });

    it('should return string from evaluateCondition', () => {
      switchNode.value = 'test';
      switchNode.cases = ['test'];
      const result = switchNode.evaluateCondition();
      expect(typeof result).toBe('string');
    });
  });

  describe('Multiple Executions', () => {
    it('should handle multiple executions with different values', () => {
      switchNode.cases = ['a', 'b', 'c'];

      // First execution - match case_0
      switchNode.value = 'a';
      switchNode.data = 'first';
      switchNode.execute();
      expect(switchNode.case_0).toBe('first');
      expect(switchNode.case_1).toBeUndefined();

      // Second execution - match case_1
      switchNode.value = 'b';
      switchNode.data = 'second';
      switchNode.execute();
      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBe('second');

      // Third execution - no match
      switchNode.value = 'z';
      switchNode.data = 'third';
      switchNode.execute();
      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBeUndefined();
      expect(switchNode.default).toBe('third');
    });

    it('should clear all outputs on each execution', () => {
      switchNode.cases = ['a', 'b'];
      switchNode.data = 'data';

      // Set case_0
      switchNode.value = 'a';
      switchNode.execute();
      expect(switchNode.case_0).toBe('data');

      // Switch to case_1 - case_0 should be cleared
      switchNode.value = 'b';
      switchNode.execute();
      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_1).toBe('data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined value', () => {
      switchNode.value = undefined;
      switchNode.cases = ['a', 'b'];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });

    it('should handle empty string as value', () => {
      switchNode.value = '';
      switchNode.cases = ['a', '', 'b'];
      switchNode.execute();

      expect(switchNode.case_1).toBeUndefined();
    });

    it('should handle NaN (NaN !== NaN, so should not match)', () => {
      switchNode.value = NaN;
      switchNode.cases = [NaN];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });

    it('should handle object reference matching', () => {
      const obj = { id: 1 };
      switchNode.value = obj;
      switchNode.cases = [obj];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
    });

    it('should not match different object instances with same content', () => {
      switchNode.value = { id: 1 };
      switchNode.cases = [{ id: 1 }];
      switchNode.execute();

      expect(switchNode.default).toBeUndefined();
    });

    it('should match first occurrence when duplicate cases exist', () => {
      switchNode.value = 'x';
      switchNode.cases = ['x', 'y', 'x'];
      switchNode.execute();

      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.case_2).toBeUndefined();
    });
  });

  describe('Default Values', () => {
    it('should have undefined value by default', () => {
      expect(switchNode.value).toBeUndefined();
    });

    it('should have empty cases array by default', () => {
      expect(switchNode.cases).toEqual([]);
    });

    it('should have undefined data by default', () => {
      expect(switchNode.data).toBeUndefined();
    });

    it('should have no outputs by default', () => {
      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });
  });
});
