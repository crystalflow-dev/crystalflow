import 'reflect-metadata';
import { Workflow } from '../../workflow/Workflow';
import { Node } from '../../node/Node';
import { NodeRegistry } from '../../node/NodeRegistry';
import { defineNode, Input, Output } from '../../node/decorators';
import { IfNode } from '../../builtin/flow/IfNode';
import { SwitchNode } from '../../builtin/flow/SwitchNode';
import { IConditionalNode } from '@reactflo/types';

/**
 * Malformed conditional node - evaluateCondition returns empty string.
 */
@defineNode({
  type: 'test.bad-conditional',
  label: 'Bad Conditional',
  category: 'Test',
})
class BadConditionalNode extends Node implements IConditionalNode {
  @Input({ type: 'boolean', label: 'Condition', required: true })
  condition: boolean = false;

  @Output({ type: 'any', label: 'Output' })
  output: unknown;

  execute(): void {
    this.output = 'executed';
  }

  // Returns empty string - invalid branch name
  evaluateCondition(): string {
    return ''; // Empty/invalid branch name
  }
}

/**
 * Conditional node that returns invalid branch names.
 */
@defineNode({
  type: 'test.invalid-branch',
  label: 'Invalid Branch',
  category: 'Test',
})
class InvalidBranchNode extends Node implements IConditionalNode {
  @Input({ type: 'string', label: 'Branch', required: true })
  branchName: string = 'nonExistentBranch';

  @Output({ type: 'any', label: 'Valid Output' })
  validOutput: unknown;

  execute(): void {
    this.validOutput = 'data';
  }

  evaluateCondition(): string {
    // Return a branch name that doesn't exist as an output
    return this.branchName;
  }
}

/**
 * Node that throws an error during execution.
 */
@defineNode({
  type: 'test.error-node',
  label: 'Error Node',
  category: 'Test',
})
class ErrorNode extends Node {
  @Input({ type: 'any', label: 'Input', required: false })
  input: unknown;

  @Output({ type: 'any', label: 'Output' })
  output: unknown;

  execute(): void {
    throw new Error('Intentional error from ErrorNode');
  }
}

/**
 * Collector node for testing.
 */
@defineNode({
  type: 'test.error-collector',
  label: 'Error Collector',
  category: 'Test',
})
class ErrorCollectorNode extends Node {
  @Input({ type: 'any', label: 'Input', required: false })
  input: unknown;

  @Output({ type: 'any', label: 'Output' })
  output: unknown;

  execute(): void {
    this.output = this.input;
  }
}

describe('Conditional Flow Error Handling', () => {
  let registry: NodeRegistry;

  beforeAll(() => {
    registry = NodeRegistry.getInstance();

    // Register test nodes
    if (!registry.has('test.bad-conditional')) {
      registry.register(BadConditionalNode);
    }
    if (!registry.has('test.invalid-branch')) {
      registry.register(InvalidBranchNode);
    }
    if (!registry.has('test.error-node')) {
      registry.register(ErrorNode);
    }
    if (!registry.has('test.error-collector')) {
      registry.register(ErrorCollectorNode);
    }
    if (!registry.has('flow.if')) {
      registry.register(IfNode);
    }
    if (!registry.has('flow.switch')) {
      registry.register(SwitchNode);
    }
  });

  describe('Missing evaluateCondition Method', () => {
    it('should handle conditional node returning empty branch name', async () => {
      const workflow = new Workflow();

      // This node returns empty string from evaluateCondition
      const badNode = workflow.addNode('test.bad-conditional');
      badNode.condition = true;

      // Execution should fail because empty branch name is invalid
      const result = await workflow.execute();

      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });

  describe('Invalid Branch Names', () => {
    it('should handle evaluateCondition returning non-existent branch name', async () => {
      const workflow = new Workflow();

      const invalidBranch = workflow.addNode('test.invalid-branch');
      const collector = workflow.addNode('test.error-collector');

      // Set invalid branch name
      invalidBranch.branchName = 'nonExistentOutput';

      // Try to connect the valid output
      workflow.connect(invalidBranch.id, 'validOutput', collector.id, 'input');

      // Execute - the node will execute but evaluateCondition returns invalid branch
      const result = await workflow.execute();

      // Should fail because the branch name doesn't exist
      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });

  describe('Error Propagation in Conditional Branches', () => {
    describe('IfNode Error Propagation', () => {
      it('should propagate error from then branch', async () => {
        const workflow = new Workflow();

        const ifNode = workflow.addNode('flow.if');
        const errorNode = workflow.addNode('test.error-node');
        const elseCollector = workflow.addNode('test.error-collector');

        // Configure: if true -> error node
        ifNode.condition = true;

        // Connect then branch to error node
        workflow.connect(ifNode.id, 'thenOutput', errorNode.id, 'input');

        // Connect else branch (should not execute)
        workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

        // Execute - should fail with error from errorNode
        const result = await workflow.execute();

        expect(result.status).toBe('failed');
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('Intentional error from ErrorNode');
        expect(elseCollector.output).toBeUndefined(); // Else branch didn't execute
      });

      it('should propagate error from else branch', async () => {
        const workflow = new Workflow();

        const ifNode = workflow.addNode('flow.if');
        const thenCollector = workflow.addNode('test.error-collector');
        const errorNode = workflow.addNode('test.error-node');

        // Configure: if false -> error node
        ifNode.condition = false;

        // Connect then branch (should not execute)
        workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');

        // Connect else branch to error node
        workflow.connect(ifNode.id, 'elseOutput', errorNode.id, 'input');

        // Execute - should fail with error from errorNode
        const result = await workflow.execute();

        expect(result.status).toBe('failed');
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('Intentional error from ErrorNode');
        expect(thenCollector.output).toBeUndefined(); // Then branch didn't execute
      });
    });

    describe('SwitchNode Error Propagation', () => {
      it('should propagate error from matching case branch', async () => {
        const workflow = new Workflow();

        const switchNode = workflow.addNode('flow.switch');
        const case0Collector = workflow.addNode('test.error-collector');
        const errorNode = workflow.addNode('test.error-node');
        const case2Collector = workflow.addNode('test.error-collector');

        // Configure: match case_1 which has error node
        switchNode.value = 'orange';
        switchNode.cases = ['apple', 'orange', 'banana'];

        // Connect case_0 (should not execute)
        workflow.connect(switchNode.id, 'case_0', case0Collector.id, 'input');

        // Connect case_1 to error node
        workflow.connect(switchNode.id, 'case_1', errorNode.id, 'input');

        // Connect case_2 (should not execute)
        workflow.connect(switchNode.id, 'case_2', case2Collector.id, 'input');

        // Execute - should fail with error from errorNode
        const result = await workflow.execute();

        expect(result.status).toBe('failed');
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('Intentional error from ErrorNode');
        expect(case0Collector.output).toBeUndefined();
        expect(case2Collector.output).toBeUndefined();
      });

      it('should propagate error from default branch', async () => {
        const workflow = new Workflow();

        const switchNode = workflow.addNode('flow.switch');
        const case0Collector = workflow.addNode('test.error-collector');
        const errorNode = workflow.addNode('test.error-node');

        // Configure: no match -> default -> error
        switchNode.value = 'grape';
        switchNode.cases = ['apple', 'orange'];

        // Connect case_0 (should not execute)
        workflow.connect(switchNode.id, 'case_0', case0Collector.id, 'input');

        // Connect default to error node
        workflow.connect(switchNode.id, 'default', errorNode.id, 'input');

        // Execute - should fail with error from errorNode
        const result = await workflow.execute();

        expect(result.status).toBe('failed');
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('Intentional error from ErrorNode');
        expect(case0Collector.output).toBeUndefined();
      });
    });

    describe('Nested Conditional Error Propagation', () => {
      it('should propagate error from nested conditional', async () => {
        const workflow = new Workflow();

        // Outer if (true) -> inner if (true) -> error node
        const outerIf = workflow.addNode('flow.if');
        const innerIf = workflow.addNode('flow.if');
        const errorNode = workflow.addNode('test.error-node');
        const elseCollector = workflow.addNode('test.error-collector');

        // Configure
        outerIf.condition = true;
        innerIf.condition = true;

        // Connect: outer.then -> inner.value -> error
        workflow.connect(outerIf.id, 'thenOutput', innerIf.id, 'value');
        workflow.connect(innerIf.id, 'thenOutput', errorNode.id, 'input');

        // Connect outer else (should not execute)
        workflow.connect(outerIf.id, 'elseOutput', elseCollector.id, 'input');

        // Execute - should fail with error from nested errorNode
        const result = await workflow.execute();

        expect(result.status).toBe('failed');
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('Intentional error from ErrorNode');
        expect(elseCollector.output).toBeUndefined();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle IfNode with no connections', async () => {
      const workflow = new Workflow();

      const ifNode = workflow.addNode('flow.if');
      ifNode.condition = true;
      ifNode.value = 'data';

      // No connections - node executes but outputs go nowhere
      const result = await workflow.execute();

      expect(result.status).toBe('success');
      expect(ifNode.thenOutput).toBe('data');
      expect(ifNode.elseOutput).toBeUndefined();
    });

    it('should handle SwitchNode with no connections', async () => {
      const workflow = new Workflow();

      const switchNode = workflow.addNode('flow.switch');
      switchNode.value = 'orange';
      switchNode.cases = ['apple', 'orange'];
      switchNode.data = 'data';

      // No connections - node executes but outputs go nowhere
      const result = await workflow.execute();

      expect(result.status).toBe('success');
      expect(switchNode.case_1).toBe('data');
      expect(switchNode.case_0).toBeUndefined();
      expect(switchNode.default).toBeUndefined();
    });

    it('should handle SwitchNode with empty cases array', async () => {
      const workflow = new Workflow();

      const switchNode = workflow.addNode('flow.switch');
      const defaultCollector = workflow.addNode('test.error-collector');

      switchNode.value = 'anything';
      switchNode.cases = []; // Empty cases
      switchNode.data = 'data';

      // Connect only default
      workflow.connect(switchNode.id, 'default', defaultCollector.id, 'input');

      const result = await workflow.execute();

      expect(result.status).toBe('success');
      expect(defaultCollector.output).toBe('data'); // Should route to default
    });

    it('should handle IfNode with undefined condition', async () => {
      const workflow = new Workflow();

      const ifNode = workflow.addNode('flow.if');
      const thenCollector = workflow.addNode('test.error-collector');
      const elseCollector = workflow.addNode('test.error-collector');

      // Don't set condition - should be undefined/falsy
      ifNode.value = 'data';

      workflow.connect(ifNode.id, 'thenOutput', thenCollector.id, 'input');
      workflow.connect(ifNode.id, 'elseOutput', elseCollector.id, 'input');

      const result = await workflow.execute();

      // Undefined is falsy, should go to else branch
      expect(result.status).toBe('success');
      expect(thenCollector.output).toBeUndefined();
      expect(elseCollector.output).toBe('data');
    });
  });
});
