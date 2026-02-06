# Visual Execution Plan

## Overview
Implement real-time visual feedback during workflow execution, showing:
- ✅ Live execution path with animated connections
- ✅ Node execution status (idle → running → success/error)
- ✅ Data flow animation between nodes
- ✅ Execution progress indicators
- ✅ Output data preview

---

## Architecture

### 1. Execution State Management (Core Package)
**Location:** `@crystalflow/core` - Enhanced `Executor` class + new `ExecutionStateTracker`

**State to Track (Core):**
```typescript
// In @crystalflow/core
interface ExecutionState {
  // Node execution states
  nodeStates: Map<string, NodeExecutionStatus>; // 'idle' | 'queued' | 'running' | 'success' | 'error'
  
  // Connection states (source->target pairs)
  connectionStates: Map<string, ConnectionExecutionState>; // connectionId -> state
  
  // Data being transferred (for inspection)
  nodeOutputs: Map<string, Record<string, unknown>>; // nodeId -> { outputPort: value }
  
  // Overall execution state
  isExecuting: boolean;
  currentNodeId: string | null;
  executionProgress: { current: number; total: number };
  executionOrder: string[]; // Topological order of node execution
}

interface ConnectionExecutionState {
  sourceNodeId: string;
  sourcePort: string;
  targetNodeId: string;
  targetPort: string;
  state: 'idle' | 'active' | 'completed'; // active = data flowing, completed = data transferred
  data?: unknown; // The data being transferred
}

type NodeExecutionStatus = 'idle' | 'queued' | 'running' | 'success' | 'error';
```

**Core Responsibilities:**
- Track execution state in a framework-agnostic way
- Emit state change events (new events: `onStateChange`, `onConnectionActive`, `onConnectionComplete`)
- Provide `getExecutionState()` method for state queries
- Update state automatically during execution
- Store connection-level state (not just node-level)
- Reset state after execution completes

**Benefits:**
- ✅ Framework-agnostic (works with React, Vue, Angular, CLI, etc.)
- ✅ Single source of truth for execution state
- ✅ Can be used for debugging, logging, monitoring
- ✅ Enables execution replay/recording at core level
- ✅ Other packages can visualize execution without reimplementing logic

---

### 2. React Package Integration Layer
**Location:** New hook `useExecutionVisuals.ts` in `@crystalflow/react`

**React-Specific State:**
```typescript
// In @crystalflow/react - transforms core state to React Flow visual state
interface ReactFlowExecutionState {
  // Edge visual states (maps to React Flow edge IDs)
  edgeStates: Map<string, EdgeVisualState>;
  
  // Node visual data (additional data for React Flow nodes)
  nodeVisualData: Map<string, NodeVisualData>;
  
  // Execution metadata for UI
  executionProgress: { current: number; total: number };
  isExecuting: boolean;
}

interface EdgeVisualState {
  isActive: boolean;      // Currently transferring data
  isCompleted: boolean;   // Has transferred data
  animationDelay?: number; // For staggered animations
}

interface NodeVisualData {
  executionStatus: NodeExecutionStatus;
  outputs?: Record<string, unknown>;
  isCurrentlyExecuting?: boolean;
}
```

**React Layer Responsibilities:**
- Subscribe to core execution state changes
- Transform core `ConnectionExecutionState` → React Flow edge visual states
- Transform core `NodeExecutionStatus` → React Flow node visual data
- Map workflow connections to React Flow edge IDs
- Provide React-specific helpers (CSS classes, styles)

---

### 2. Visual Updates

#### 2.1. Node Visual States
**Files to modify:**
- `CustomNode.tsx` - Add execution status indicator
- `customNode.css` - Already has status styles (✅ existing)

**Implementation:**
```tsx
// CustomNode.tsx - Add status indicator
<div className={`node-status node-status--${executionStatus}`} />
```

**CSS Classes (Already exist in customNode.css):**
- `.node-status--idle` - Gray (default)
- `.node-status--running` - Blue with pulse animation
- `.node-status--success` - Green
- `.node-status--error` - Red with shake animation

#### 2.2. Edge Visual States
**Files to modify:**
- `WorkflowCanvas.tsx` - Apply dynamic edge styles
- New CSS file: `executionEdges.css`

**Edge States:**
```typescript
interface EdgeVisualState {
  isActive: boolean;      // Currently transferring data
  isCompleted: boolean;   // Has transferred data
  animationDelay?: number; // For staggered animations
}
```

**CSS Classes to Add:**
```css
/* Default edge */
.react-flow__edge-path {
  stroke: var(--color-border-medium);
  stroke-width: 2;
}

/* Active edge - data flowing */
.react-flow__edge.edge-active .react-flow__edge-path {
  stroke: var(--color-success-500);
  stroke-width: 3;
  animation: dash-flow 1s linear infinite;
}

/* Completed edge - data transferred */
.react-flow__edge.edge-completed .react-flow__edge-path {
  stroke: var(--color-success-400);
  stroke-width: 2.5;
}

/* Animated dash effect */
@keyframes dash-flow {
  to {
    stroke-dashoffset: -24;
  }
}
```

#### 2.3. Data Flow Animation
**Animated particle/pulse traveling along edges**

Options:
1. **CSS-based**: Animated dot using `::after` pseudo-element
2. **SVG-based**: Animated circle element on the edge path
3. **React Flow EdgeMarker**: Custom animated marker

**Recommended: CSS Pseudo-element**
```css
.react-flow__edge.edge-active::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-success-500);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--color-success-500);
  animation: particle-flow 0.8s ease-in-out;
}

@keyframes particle-flow {
  from {
    offset-distance: 0%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  to {
    offset-distance: 100%;
    opacity: 0;
  }
}
```

---

### 3. Component Integration

#### 3.1. WorkflowBuilder Integration
**File:** `WorkflowBuilder.tsx`

**Changes:**
1. Use `useExecutionVisuals` hook (which subscribes to core state)
2. Pass execution states to child components
3. Core Executor automatically tracks state

```tsx
// WorkflowBuilder now uses the hook that subscribes to core state
const { 
  edgeStates, 
  nodeVisualData, 
  isExecuting, 
  executionProgress 
} = useExecutionVisuals(executor, nodes, edges);

// No manual event handlers needed - core tracks state automatically!
// Just execute the workflow:
const handleExecute = useCallback(async () => {
  try {
    const result = await executeWorkflow(nodes, edges);
    // Core Executor automatically emits state changes
    // useExecutionVisuals subscribes and updates React state
    onExecute?.(result);
  } catch (error) {
    onError?.(error);
  }
}, [nodes, edges, executeWorkflow, onExecute, onError]);
```

**Benefits:**
- ✅ No manual state management in React layer
- ✅ Core handles all execution logic
- ✅ React layer just visualizes core state
- ✅ Can add other visualizations (Vue, Angular) easily

#### 3.2. WorkflowCanvas Updates
**File:** `WorkflowCanvas.tsx`

**Changes:**
1. Apply edge classes based on execution state
2. Apply node data updates for execution status

```tsx
// Transform edges with execution state
const styledEdges = useMemo(() => 
  edges.map(edge => ({
    ...edge,
    className: cn(
      edge.className,
      executionState.activeConnections.has(edge.id) && 'edge-active',
      executionState.completedConnections.has(edge.id) && 'edge-completed'
    ),
    animated: executionState.activeConnections.has(edge.id)
  })),
  [edges, executionState]
);

// Update node data with execution status
const styledNodes = useMemo(() =>
  nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      executionStatus: executionState.nodeStates.get(node.id) || 'idle',
      outputs: executionState.nodeOutputs.get(node.id)
    }
  })),
  [nodes, executionState]
);
```

#### 3.3. CustomNode Updates
**File:** `CustomNode.tsx`

**Changes:**
1. Read executionStatus from node data
2. Render status indicator
3. Optional: Show output preview

```tsx
export interface CustomNodeData {
  // ... existing fields
  executionStatus?: 'idle' | 'running' | 'success' | 'error';
  outputs?: Record<string, unknown>;
}

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const nodeData = data as CustomNodeData;
  const executionStatus = nodeData.executionStatus || 'idle';
  
  return (
    <>
      {/* Execution status indicator */}
      {executionStatus !== 'idle' && (
        <div 
          className={`node-status node-status--${executionStatus}`}
          title={`Status: ${executionStatus}`}
        />
      )}
      
      {/* ... rest of node content */}
      
      {/* Optional: Output preview */}
      {nodeData.outputs && (
        <div className="node-outputs-preview">
          {Object.entries(nodeData.outputs).map(([key, value]) => (
            <div key={key} className="output-preview-item">
              <span className="output-key">{key}:</span>
              <span className="output-value">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
```

---

### 4. Timing & Animation Strategy

#### 4.1. Execution Flow Timing
```
Node A starts → Edge A→B animates (0.8s) → Node B starts → Edge B→C animates (0.8s) → Node C starts
     ↓              ↓                           ↓              ↓                           ↓
  running      active edge                  running      active edge                  running
     ↓              ↓                           ↓              ↓                           ↓
  success      completed edge              success      completed edge              success
```

#### 4.2. Animation Delays
- **Edge activation**: Instant (when source node completes)
- **Edge animation duration**: 800ms (particle flow)
- **Node status transition**: Instant with CSS transition
- **Cleanup**: After execution completes, fade out after 2s (optional)

#### 4.3. Auto-Cleanup (Optional Feature)
```typescript
// Reset visual state after execution completes
useEffect(() => {
  if (!executionState.isExecuting && executionState.completedConnections.size > 0) {
    const timeout = setTimeout(() => {
      setExecutionState({
        nodeStates: new Map(),
        activeConnections: new Set(),
        completedConnections: new Set(),
        nodeOutputs: new Map(),
        isExecuting: false,
        executionProgress: { current: 0, total: 0 }
      });
    }, 3000); // Keep highlighted for 3s after completion
    
    return () => clearTimeout(timeout);
  }
}, [executionState.isExecuting]);
```

---

## Implementation Checklist

### Phase 1: Core Package - Execution State Management
**Package:** `@crystalflow/core`

- [x] Define execution state interfaces in `@crystalflow/types`
  - [x] `ExecutionState` interface
  - [x] `ConnectionExecutionState` interface
  - [x] `NodeExecutionStatus` type
- [x] Create `ExecutionStateTracker` class in `@crystalflow/core`
  - [x] Track node states (idle → queued → running → success/error)
  - [x] Track connection states (idle → active → completed)
  - [x] Store node outputs for inspection
  - [x] Provide `getExecutionState()` method
  - [x] Provide `reset()` method
- [x] Enhance `Executor` class
  - [x] Integrate `ExecutionStateTracker`
  - [x] Emit new events: `onStateChange`, `onConnectionActive`, `onConnectionComplete`
  - [x] Update state during execution loop
  - [x] Calculate execution order (topological sort)
- [x] Add tests for execution state tracking
  - [x] Test node state transitions
  - [x] Test connection state tracking
  - [x] Test state reset
  - [x] Test state queries

### Phase 1b: Types Package
**Package:** `@crystalflow/types`

- [x] Add execution state type definitions
- [x] Export from main index

### Phase 2: React Package - Integration Hook
**Package:** `@crystalflow/react`

- [x] Create `useExecutionVisuals.ts` hook
  - [x] Subscribe to core execution state events
  - [x] Transform core state → React Flow visual state
  - [x] Map workflow connections → React Flow edge IDs
  - [x] Provide edge visual states
  - [x] Provide node visual data
  - [x] Handle cleanup on unmount
- [x] Export hook from `hooks/index.ts`

### Phase 3: CSS Styles for Execution Visualization
**Package:** `@crystalflow/react`

- [x] Create `executionEdges.css`
- [x] Add edge animation styles (active, completed, particle flow)
- [x] Update `customNode.css` if needed (status indicator positioning)
- [x] Add output preview styles (optional)
- [x] Import in `cssInJs.ts`

### Phase 4: Node Integration
**Package:** `@crystalflow/react`

- [x] Update `CustomNodeData` interface with execution fields
- [x] Add status indicator to `CustomNode.tsx`
- [x] Add output preview UI (optional)
- [x] Test node visual states

### Phase 5: Edge Integration
**Package:** `@crystalflow/react`

- [x] Update `WorkflowCanvas.tsx` to apply edge styles
- [x] Transform edges with execution state classes
- [x] Enable `animated` prop for active edges
- [x] Test edge animations

### Phase 6: WorkflowBuilder Integration
**Package:** `@crystalflow/react`

- [x] Add `useExecutionVisuals` to WorkflowBuilder
- [x] Pass executor instance to the hook
- [x] Pass execution state to WorkflowCanvas and nodes
- [x] Handle execution start/complete/reset
- [x] Update execution handler to use new events
- [x] Update `useWorkflowExecution` to accept custom executor

### Phase 7: End-to-End Testing
**Both Packages**

- [ ] Test with simple workflow (2-3 nodes) ⏳
- [ ] Test with complex workflow (branching, multiple paths)
- [ ] Test error states
- [ ] Test state queries from core
- [ ] Verify core state works without React (unit tests)
- [ ] Adjust animation timings
- [ ] Add accessibility (ARIA labels for status)
- [ ] Performance optimization (memoization)

### Phase 8: Documentation
**Both Packages**

- [ ] Document `ExecutionStateTracker` API in core docs
- [ ] Document execution state events in core docs
- [ ] Document `useExecutionVisuals` hook in react docs
- [ ] Add example: using execution state without React
- [ ] Add example: custom execution visualization
- [ ] Update architecture diagrams

### Phase 9: Advanced Features (Optional - Future)
- [ ] Add execution progress indicator in toolbar
- [ ] Add data flow tooltip on hover
- [ ] Add execution playback controls (pause/step/speed)
- [ ] Add execution history/timeline view
- [ ] Add configurable animation speed
- [ ] Export execution state to JSON (for debugging)
- [ ] Execution recording/replay from core state

---

## Technical Decisions

### ✅ Decisions Made
1. **State Management**: Core package manages state, React package visualizes it
2. **Architecture**: Framework-agnostic core + React visualization layer
3. **Animation Approach**: CSS-based for performance
4. **Edge Styling**: React Flow className + CSS
5. **Node Status**: Small circular indicator (top-right corner)
6. **Colors**: Success (green), Running (blue), Error (red), Idle (gray), Queued (light blue)
7. **Core Events**: New events (`onStateChange`, `onConnectionActive`, `onConnectionComplete`)
8. **State Access**: Core provides `getExecutionState()` method for queries

### 🤔 Questions to Resolve
1. **Auto-cleanup**: Should execution state auto-reset or manual reset only?
2. **Output preview**: Always show or toggle via button?
3. **Animation speed**: Fixed or user-configurable?
4. **Execution replay**: Do we want to replay the execution animation?

---

## Files to Create

### Core Package (@crystalflow/core)
- [x] `packages/core/src/execution/ExecutionStateTracker.ts` (new)
- [x] `packages/core/src/execution/__tests__/ExecutionStateTracker.test.ts` (new)

### Types Package (@crystalflow/types)
- [x] `packages/types/src/execution-state.ts` (new - execution state interfaces)

### React Package (@crystalflow/react)
- [x] `packages/react/src/hooks/useExecutionVisuals.ts` (new)
- [x] `packages/react/src/styles/executionEdges.css` (new)

## Files to Modify

### Core Package (@crystalflow/core)
- [x] `packages/core/src/execution/Executor.ts` (integrate ExecutionStateTracker)
- [x] `packages/core/src/execution/index.ts` (export ExecutionStateTracker)
- [ ] `packages/core/src/index.ts` (export execution state types)

### Types Package (@crystalflow/types)
- [ ] `packages/types/src/index.ts` (export execution state types)

### React Package (@crystalflow/react)
- [ ] `packages/react/src/components/WorkflowBuilder/WorkflowBuilder.tsx`
- [ ] `packages/react/src/components/WorkflowCanvas/WorkflowCanvas.tsx`
- [ ] `packages/react/src/components/Node/CustomNode.tsx`
- [ ] `packages/react/src/styles/customNode.css` (minor tweaks)
- [ ] `packages/react/src/hooks/index.ts` (export new hook)
- [ ] `packages/react/src/styles/cssInJs.ts` (include new CSS)

---

## Progress Tracker

### Status: � Phase 1 Complete - Moving to Phase 2

**Current Phase:** Phase 1 - Core Package ✅ COMPLETE

**Completed:**
- ✅ Execution state type definitions in `@crystalflow/types`
- ✅ `ExecutionStateTracker` class with full state management
- ✅ Executor integration with new events (`onStateChange`, `onConnectionActive`, `onConnectionComplete`)
- ✅ 38 passing tests for ExecutionStateTracker
- ✅ All exports configured

**Next Steps:**
1. Start Phase 2 - React Package Integration Hook
2. Create `useExecutionVisuals` hook
3. Subscribe to core execution events

---

## Notes & Considerations

### Performance
- Use `useMemo` for edge/node transformations
- Avoid re-rendering all nodes on every state change
- Consider `React.memo` for CustomNode if needed

### Accessibility
- Add ARIA labels for execution status
- Ensure color contrast meets WCAG standards
- Support keyboard navigation during execution

### Browser Compatibility
- CSS animations supported in all modern browsers
- Fallback for older browsers: No animation, just color changes

### Future Enhancements
- WebSocket support for remote execution
- Execution recording/playback
- Performance metrics display
- Execution timeline visualization

---

## Core Package API Design

### ExecutionStateTracker Class
```typescript
// @crystalflow/core/src/execution/ExecutionStateTracker.ts

export class ExecutionStateTracker {
  private state: ExecutionState;
  
  constructor() {
    this.state = this.createInitialState();
  }
  
  // State queries
  getState(): ExecutionState;
  getNodeState(nodeId: string): NodeExecutionStatus;
  getConnectionState(connectionId: string): ConnectionExecutionState | undefined;
  
  // State updates (called by Executor)
  setNodeState(nodeId: string, status: NodeExecutionStatus): void;
  setConnectionActive(connectionId: string, data: unknown): void;
  setConnectionCompleted(connectionId: string): void;
  setNodeOutput(nodeId: string, outputs: Record<string, unknown>): void;
  
  // Lifecycle
  startExecution(executionOrder: string[]): void;
  completeExecution(): void;
  reset(): void;
  
  // Serialization (for debugging/logging)
  toJSON(): object;
}
```

### Enhanced Executor Events
```typescript
// New events added to Executor class

executor.on('onStateChange', (state: ExecutionState) => {
  // Fired whenever execution state changes
  // Useful for real-time monitoring, logging, UI updates
});

executor.on('onConnectionActive', (connection: ConnectionExecutionState) => {
  // Fired when data starts flowing through a connection
  // Useful for animating edges
});

executor.on('onConnectionComplete', (connection: ConnectionExecutionState) => {
  // Fired when data transfer is complete
  // Useful for updating edge visual state
});
```

### Usage Example (Non-React)
```typescript
import { Workflow, Executor } from '@crystalflow/core';

const workflow = new Workflow();
const executor = new Executor();

// Monitor execution state
executor.on('onStateChange', (state) => {
  console.log('Node states:', state.nodeStates);
  console.log('Progress:', state.executionProgress);
});

executor.on('onConnectionActive', (conn) => {
  console.log(`Data flowing: ${conn.sourceNodeId} -> ${conn.targetNodeId}`);
  console.log('Data:', conn.data);
});

// Execute
await executor.execute(workflow);

// Query final state
const finalState = executor.getExecutionState();
console.log('Final outputs:', finalState.nodeOutputs);
```

---

**Last Updated:** 2026-02-03
**Status:** Phases 1-6 COMPLETE ✅ | Phase 7 Testing In Progress ⏳
**Completed:**
- ✅ Core execution state tracking (Phase 1)
- ✅ React integration hook (Phase 2)
- ✅ CSS animations and styles (Phase 3)
- ✅ Node status indicators (Phase 4)
- ✅ Edge animation system (Phase 5)
- ✅ WorkflowBuilder integration (Phase 6)
**Next:** End-to-end testing with example workflows
