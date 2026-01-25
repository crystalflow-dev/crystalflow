/**
 * Executor Performance Benchmarks
 * 
 * These benchmarks measure execution time for various workflow scenarios
 * to ensure the new execution plan architecture doesn't introduce performance regressions.
 * 
 * Run with: npm run test:benchmark
 */

import { Workflow } from '../../workflow/Workflow';
import { Executor } from '../../execution/Executor';
import { Node } from '../../node/Node';
import { defineNode, Input, Output } from '../../node/decorators';
import { NodeRegistry } from '../../node/NodeRegistry';

// ============================================================
// BENCHMARK HELPER UTILITIES
// ============================================================

interface BenchmarkResult {
  scenario: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  median: number;
  stdDev: number;
}

async function benchmark(
  name: string,
  fn: () => Promise<void>,
  iterations: number = 100
): Promise<BenchmarkResult> {
  const times: number[] = [];
  
  // Warm-up runs (not counted)
  for (let i = 0; i < 5; i++) {
    await fn();
  }
  
  // Actual benchmark runs
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  // Calculate statistics
  const totalTime = times.reduce((sum, t) => sum + t, 0);
  const averageTime = totalTime / iterations;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  // Calculate median
  const sorted = [...times].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // Calculate standard deviation
  const variance = times.reduce((sum, t) => sum + Math.pow(t - averageTime, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);
  
  return {
    scenario: name,
    iterations,
    totalTime,
    averageTime,
    minTime,
    maxTime,
    median,
    stdDev
  };
}

function printBenchmarkResult(result: BenchmarkResult): void {
  console.log(`\n📊 ${result.scenario}`);
  console.log(`   Iterations: ${result.iterations}`);
  console.log(`   Average:    ${result.averageTime.toFixed(3)} ms`);
  console.log(`   Median:     ${result.median.toFixed(3)} ms`);
  console.log(`   Min:        ${result.minTime.toFixed(3)} ms`);
  console.log(`   Max:        ${result.maxTime.toFixed(3)} ms`);
  console.log(`   Std Dev:    ${result.stdDev.toFixed(3)} ms`);
  console.log(`   Total:      ${result.totalTime.toFixed(3)} ms`);
}

// ============================================================
// BENCHMARK NODE DEFINITIONS
// ============================================================

/**
 * Fast node - minimal computation
 */
@defineNode({
  type: 'benchmark.fast',
  label: 'Fast Node',
  category: 'Benchmark'
})
class FastNode extends Node {
  @Input({ type: 'number', label: 'Input' })
  input: number = 0;

  @Output({ type: 'number', label: 'Output' })
  output: number = 0;

  execute(): void {
    this.output = this.input + 1;
  }
}

/**
 * Medium node - some computation
 */
@defineNode({
  type: 'benchmark.medium',
  label: 'Medium Node',
  category: 'Benchmark'
})
class MediumNode extends Node {
  @Input({ type: 'number', label: 'Input' })
  input: number = 0;

  @Output({ type: 'number', label: 'Output' })
  output: number = 0;

  execute(): void {
    // Simulate some computation
    let result = this.input;
    for (let i = 0; i < 100; i++) {
      result = Math.sqrt(result + 1);
    }
    this.output = result;
  }
}

/**
 * Slow node - significant computation
 */
@defineNode({
  type: 'benchmark.slow',
  label: 'Slow Node',
  category: 'Benchmark'
})
class SlowNode extends Node {
  @Input({ type: 'number', label: 'Input' })
  input: number = 0;

  @Output({ type: 'number', label: 'Output' })
  output: number = 0;

  execute(): void {
    // Simulate heavy computation
    let result = this.input;
    for (let i = 0; i < 1000; i++) {
      result = Math.sqrt(result + 1) * Math.sin(i);
    }
    this.output = result;
  }
}

/**
 * Async node - simulates I/O
 */
@defineNode({
  type: 'benchmark.async',
  label: 'Async Node',
  category: 'Benchmark'
})
class AsyncNode extends Node {
  @Input({ type: 'number', label: 'Input' })
  input: number = 0;

  @Output({ type: 'number', label: 'Output' })
  output: number = 0;

  async execute(): Promise<void> {
    // Simulate async I/O (1ms delay)
    await new Promise(resolve => setTimeout(resolve, 1));
    this.output = this.input + 1;
  }
}

// ============================================================
// BENCHMARK SCENARIOS
// ============================================================

describe('Executor Performance Benchmarks', () => {
  const executor = new Executor();

  // Register benchmark nodes once before all tests
  beforeAll(() => {
    const registry = NodeRegistry.getInstance();
    
    // Only register if not already registered
    if (!registry.has('benchmark.fast')) {
      registry.register(FastNode);
    }
    if (!registry.has('benchmark.medium')) {
      registry.register(MediumNode);
    }
    if (!registry.has('benchmark.slow')) {
      registry.register(SlowNode);
    }
    if (!registry.has('benchmark.async')) {
      registry.register(AsyncNode);
    }
  });

  /**
   * Scenario 1: Linear workflow with fast nodes
   * Tests basic execution overhead with minimal node computation
   */
  describe('Scenario 1: Linear Fast Nodes', () => {
    it('should benchmark 10 sequential fast nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('linear-fast-10', 'Linear Fast 10');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 10; i++) {
          const node = workflow.addNode('benchmark.fast');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Linear: 10 Fast Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        100
      );

      printBenchmarkResult(result);
      
      // Performance assertion (should be very fast)
      expect(result.averageTime).toBeLessThan(10); // < 10ms average
    });

    it('should benchmark 50 sequential fast nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('linear-fast-50', 'Linear Fast 50');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 50; i++) {
          const node = workflow.addNode('benchmark.fast');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Linear: 50 Fast Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        50
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(50); // < 50ms average
    });

    it('should benchmark 100 sequential fast nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('linear-fast-100', 'Linear Fast 100');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 100; i++) {
          const node = workflow.addNode('benchmark.fast');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Linear: 100 Fast Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        20
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(100); // < 100ms average
    });
  });

  /**
   * Scenario 2: Linear workflow with medium computation nodes
   * Tests execution with moderate node computation
   */
  describe('Scenario 2: Linear Medium Nodes', () => {
    it('should benchmark 20 sequential medium nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('linear-medium-20', 'Linear Medium 20');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 20; i++) {
          const node = workflow.addNode('benchmark.medium');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Linear: 20 Medium Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        50
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(50); // < 50ms average
    });
  });

  /**
   * Scenario 3: Linear workflow with slow nodes
   * Tests execution with heavy node computation
   */
  describe('Scenario 3: Linear Slow Nodes', () => {
    it('should benchmark 10 sequential slow nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('linear-slow-10', 'Linear Slow 10');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 10; i++) {
          const node = workflow.addNode('benchmark.slow');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Linear: 10 Slow Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        20
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(500); // < 500ms average
    });
  });

  /**
   * Scenario 4: Fan-out pattern (1 node → multiple nodes)
   * Tests execution with multiple independent branches
   */
  describe('Scenario 4: Fan-Out Pattern', () => {
    it('should benchmark fan-out with 10 branches', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('fan-out-10', 'Fan-Out 10');
        
        const source = workflow.addNode('benchmark.fast');
        
        // Create 10 branches
        for (let i = 0; i < 10; i++) {
          const branch = workflow.addNode('benchmark.medium');
          workflow.connect(source.id, 'output', branch.id, 'input');
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Fan-Out: 10 Branches',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        50
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(100); // < 100ms average
    });

    it('should benchmark fan-out with 50 branches', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('fan-out-50', 'Fan-Out 50');
        
        const source = workflow.addNode('benchmark.fast');
        
        // Create 50 branches
        for (let i = 0; i < 50; i++) {
          const branch = workflow.addNode('benchmark.fast');
          workflow.connect(source.id, 'output', branch.id, 'input');
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Fan-Out: 50 Branches',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        30
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(200); // < 200ms average
    });
  });

  /**
   * Scenario 5: Diamond pattern (fan-out then fan-in)
   * Tests execution with branching and merging
   */
  describe('Scenario 5: Diamond Pattern', () => {
    it('should benchmark diamond pattern with 5 middle nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('diamond-5', 'Diamond 5');
        
        const source = workflow.addNode('benchmark.fast');
        const sink = workflow.addNode('benchmark.fast');
        
        // Create 5 middle nodes (diamond pattern)
        for (let i = 0; i < 5; i++) {
          const middle = workflow.addNode('benchmark.medium');
          workflow.connect(source.id, 'output', middle.id, 'input');
          workflow.connect(middle.id, 'output', sink.id, 'input');
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Diamond: 5 Middle Nodes',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        50
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(50); // < 50ms average
    });
  });

  /**
   * Scenario 6: Complex graph (mixed patterns)
   * Tests execution with realistic complex workflow structure
   */
  describe('Scenario 6: Complex Graph', () => {
    it('should benchmark complex workflow (50 nodes, mixed connections)', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('complex-50', 'Complex 50');
        
        // Create a complex graph structure
        const nodes: string[] = [];
        
        // Layer 1: 5 source nodes
        for (let i = 0; i < 5; i++) {
          const node = workflow.addNode('benchmark.fast');
          nodes.push(node.id);
        }
        
        // Layer 2: 15 processing nodes (connect to random layer 1 nodes)
        const layer1End = nodes.length;
        for (let i = 0; i < 15; i++) {
          const node = workflow.addNode('benchmark.medium');
          const sourceIdx = Math.floor(Math.random() * layer1End);
          workflow.connect(nodes[sourceIdx], 'output', node.id, 'input');
          nodes.push(node.id);
        }
        
        // Layer 3: 20 more processing nodes (connect to layer 2)
        const layer2End = nodes.length;
        for (let i = 0; i < 20; i++) {
          const node = workflow.addNode('benchmark.fast');
          const sourceIdx = layer1End + Math.floor(Math.random() * (layer2End - layer1End));
          workflow.connect(nodes[sourceIdx], 'output', node.id, 'input');
          nodes.push(node.id);
        }
        
        // Layer 4: 10 sink nodes (connect to layer 3)
        const layer3End = nodes.length;
        for (let i = 0; i < 10; i++) {
          const node = workflow.addNode('benchmark.fast');
          const sourceIdx = layer2End + Math.floor(Math.random() * (layer3End - layer2End));
          workflow.connect(nodes[sourceIdx], 'output', node.id, 'input');
          nodes.push(node.id);
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Complex: 50 Nodes Mixed',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        20
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(200); // < 200ms average
    });
  });

  /**
   * Scenario 7: Async nodes
   * Tests execution with async operations (simulating I/O)
   */
  describe('Scenario 7: Async Operations', () => {
    it('should benchmark 20 sequential async nodes', async () => {
      const createWorkflow = () => {
        const workflow = new Workflow('async-20', 'Async 20');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 20; i++) {
          const node = workflow.addNode('benchmark.async');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Async: 20 Nodes Sequential',
        async () => {
          const workflow = createWorkflow();
          await executor.execute(workflow);
        },
        30
      );

      printBenchmarkResult(result);
      
      // Should be ~20ms (20 nodes * 1ms each) + overhead
      expect(result.averageTime).toBeLessThan(100); // < 100ms average
    });
  });

  /**
   * Scenario 8: Event system overhead
   * Tests execution with event listeners attached
   */
  describe('Scenario 8: Event System Overhead', () => {
    it('should benchmark with event listeners attached', async () => {
      const executorWithEvents = new Executor();
      
      // Attach event listeners
      executorWithEvents.on('beforeExecute', async () => {
        // Simulate some work
        await Promise.resolve();
      });
      
      executorWithEvents.on('onNodeStart', async () => {
        await Promise.resolve();
      });
      
      executorWithEvents.on('onNodeComplete', async () => {
        await Promise.resolve();
      });
      
      executorWithEvents.on('afterExecute', async () => {
        await Promise.resolve();
      });

      const createWorkflow = () => {
        const workflow = new Workflow('events-20', 'Events 20');
        
        let prevNodeId: string | null = null;
        for (let i = 0; i < 20; i++) {
          const node = workflow.addNode('benchmark.fast');
          
          if (prevNodeId) {
            workflow.connect(prevNodeId, 'output', node.id, 'input');
          }
          
          prevNodeId = node.id;
        }
        
        return workflow;
      };

      const result = await benchmark(
        'Events: 20 Nodes with Listeners',
        async () => {
          const workflow = createWorkflow();
          await executorWithEvents.execute(workflow);
        },
        50
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(50); // < 50ms average
    });
  });

  /**
   * Scenario 9: Workflow validation overhead
   * Tests validation performance on complex workflows
   */
  describe('Scenario 9: Validation Overhead', () => {
    it('should benchmark validation of complex workflow', async () => {
      const workflow = new Workflow('validation-test', 'Validation Test');
      
      // Create complex graph
      const nodes: string[] = [];
      for (let i = 0; i < 100; i++) {
        const node = workflow.addNode('benchmark.fast');
        nodes.push(node.id);
        
        // Connect to 2-3 previous nodes randomly
        if (i > 0) {
          const numConnections = Math.min(i, 1 + Math.floor(Math.random() * 2));
          for (let j = 0; j < numConnections; j++) {
            const sourceIdx = Math.floor(Math.random() * i);
            workflow.connect(nodes[sourceIdx], 'output', node.id, 'input');
          }
        }
      }

      const result = await benchmark(
        'Validation: 100 Nodes Complex',
        async () => {
          workflow.validate();
        },
        100
      );

      printBenchmarkResult(result);
      
      expect(result.averageTime).toBeLessThan(10); // < 10ms average
    });
  });

  /**
   * Summary: Print all benchmark results
   */
  afterAll(() => {
    console.log('\n' + '='.repeat(70));
    console.log('📈 BENCHMARK SUMMARY');
    console.log('='.repeat(70));
    console.log('All benchmarks completed successfully!');
    console.log('These results establish baseline performance for the current executor.');
    console.log('After implementing the execution plan architecture, run these benchmarks');
    console.log('again to compare performance and ensure no regressions.');
    console.log('='.repeat(70) + '\n');
  });
});
