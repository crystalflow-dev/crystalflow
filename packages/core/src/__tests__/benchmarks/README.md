# Executor Performance Benchmarks

This directory contains comprehensive performance benchmarks for the CrystalFlow execution engine.

## Purpose

These benchmarks serve two critical purposes:

1. **Baseline Establishment**: Measure current executor performance across various scenarios
2. **Regression Prevention**: Compare new execution plan architecture against baseline to ensure no performance degradation

## Running Benchmarks

### Run all benchmarks:

```bash
cd packages/core
npm run test:benchmark
```

### Run from project root:

```bash
npm run test:benchmark -w @crystalflow/core
```

### Run specific scenario:

```bash
npm test -- --testPathPatterns=benchmarks --testNamePattern="Linear Fast"
```

## Benchmark Scenarios

### Scenario 1: Linear Fast Nodes

- **Purpose**: Test basic execution overhead with minimal computation
- **Configurations**: 10, 50, 100 nodes
- **Expected**: Very low overhead, should scale linearly

### Scenario 2: Linear Medium Nodes

- **Purpose**: Test execution with moderate computation
- **Configurations**: 20 nodes
- **Expected**: Node computation should dominate, minimal executor overhead

### Scenario 3: Linear Slow Nodes

- **Purpose**: Test execution with heavy computation
- **Configurations**: 10 nodes
- **Expected**: Node computation dominates completely

### Scenario 4: Fan-Out Pattern

- **Purpose**: Test execution with multiple independent branches
- **Configurations**: 10, 50 branches
- **Expected**: All branches execute sequentially in current implementation

### Scenario 5: Diamond Pattern

- **Purpose**: Test execution with branching and merging
- **Configurations**: 5 middle nodes
- **Expected**: Tests data propagation through multiple paths

### Scenario 6: Complex Graph

- **Purpose**: Realistic complex workflow structure
- **Configurations**: 50 nodes with mixed connections
- **Expected**: Tests topological sort and data flow efficiency

### Scenario 7: Async Operations

- **Purpose**: Test execution with async nodes (simulating I/O)
- **Configurations**: 20 async nodes
- **Expected**: Should handle promises efficiently

### Scenario 8: Event System Overhead

- **Purpose**: Measure overhead of event system with listeners
- **Configurations**: 20 nodes with 4 event listeners
- **Expected**: Async event handling should have minimal overhead

### Scenario 9: Validation Overhead

- **Purpose**: Measure workflow validation performance
- **Configurations**: 100 nodes complex graph
- **Expected**: Cycle detection should be fast even on large graphs

## Interpreting Results

Each benchmark reports:

- **Average**: Mean execution time (most important metric)
- **Median**: Middle value (less affected by outliers)
- **Min/Max**: Best and worst case times
- **Std Dev**: Consistency of performance
- **Total**: Sum of all iterations

### Expected Performance Ranges (Current Implementation)

| Scenario        | Expected Average | Notes                      |
| --------------- | ---------------- | -------------------------- |
| 10 Fast Nodes   | < 10ms           | Mostly executor overhead   |
| 50 Fast Nodes   | < 50ms           | Should scale linearly      |
| 100 Fast Nodes  | < 100ms          | Should scale linearly      |
| 20 Medium Nodes | < 50ms           | Node computation dominates |
| 10 Slow Nodes   | < 500ms          | Heavy computation          |
| Fan-Out 10      | < 100ms          | Sequential execution       |
| Fan-Out 50      | < 200ms          | Sequential execution       |
| Diamond 5       | < 50ms           | Data propagation test      |
| Complex 50      | < 200ms          | Realistic workload         |
| 20 Async Nodes  | < 100ms          | ~20ms + overhead           |
| Events 20       | < 50ms           | Event overhead minimal     |
| Validation 100  | < 10ms           | Graph algorithms efficient |

## Comparison Methodology

After implementing the execution plan architecture:

1. **Run Current Benchmarks**:

   ```bash
   npm run test:benchmark > benchmarks-current.txt
   ```

2. **Implement Execution Plan Architecture** (Phase 1)

3. **Run New Benchmarks**:

   ```bash
   npm run test:benchmark > benchmarks-plan.txt
   ```

4. **Compare Results**:
   - Average time should be within ±10% (acceptable variance)
   - If new implementation is slower by >20%, investigate
   - If new implementation is faster, great! (but verify correctness)

### Acceptance Criteria

The execution plan implementation should:

- ✅ **No scenario regresses** by more than 20%
- ✅ **Average across all scenarios** within ±10%
- ✅ **Complex scenarios** (50+ nodes) maintain performance
- ✅ **Event system overhead** remains minimal
- ✅ **Memory usage** doesn't increase significantly

## Performance Optimization Tips

If benchmarks show regressions:

1. **Plan Building**: Check if building the plan is expensive
   - Profile `ExecutionPlanBuilder.build()`
   - Consider caching plans for static workflows
2. **Step Execution**: Check step dispatch overhead
   - Profile `executeStep()` dispatch logic
   - Consider optimizing step type checks

3. **Memory Allocations**: Check for excessive allocations
   - Use Chrome DevTools Memory Profiler
   - Look for unnecessary object creation in hot paths

4. **Async Overhead**: Check promise handling
   - Ensure we're not creating unnecessary promises
   - Consider synchronous path for sync nodes

## Benchmark Node Types

These custom nodes are used for benchmarking:

- **FastNode**: Minimal computation (input + 1)
- **MediumNode**: Moderate computation (100 iterations of math)
- **SlowNode**: Heavy computation (1000 iterations of math)
- **AsyncNode**: Simulates I/O with 1ms delay

## Notes

- Benchmarks include 5 warm-up runs (not counted)
- Each scenario runs multiple iterations for statistical accuracy
- Times measured with `performance.now()` for high resolution
- Benchmarks run in Node.js environment (not browser)
- Results may vary based on system load and hardware

## Future Benchmarks

After control flow implementation, add:

- **Conditional branches**: If/else execution paths
- **Loop iterations**: For/while loop performance
- **Parallel execution**: Concurrent branch execution
- **Nested control flow**: Complex nested patterns
- **Debugging overhead**: Breakpoints and step operations
