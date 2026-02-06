/**
 * Async Execution Demo
 *
 * This example demonstrates workflow execution with time-consuming nodes
 * Perfect for testing execution visualization, progress tracking, and cancellation
 */

import { WorkflowBuilder } from '@crystalflow/react';
import {
  FetchDataNode,
  ProcessDataNode,
  BatchProcessNode,
  SlowProcessNode,
  DisplayNode,
} from '../nodes';
import { asyncExecutionWorkflow } from '../workflows/defaultWorkflows';

interface AsyncExecutionDemoProps {
  theme?: 'light' | 'dark';
}

/**
 * Async Execution Demo Component
 *
 * Features nodes with various execution times:
 * - FetchDataNode: 1.5-4s (simulates API calls)
 * - ProcessDataNode: 0.5-2s (simulates data processing)
 * - BatchProcessNode: Variable time based on batch settings
 * - SlowProcessNode: Configurable delay (100ms-10s)
 */
function AsyncExecutionDemo({ theme = 'light' }: AsyncExecutionDemoProps) {
  return (
    <div className="example-container">
      <div className="workflow-container">
        <WorkflowBuilder
          nodes={[FetchDataNode, ProcessDataNode, BatchProcessNode, SlowProcessNode, DisplayNode]}
          initialWorkflow={asyncExecutionWorkflow}
          showPalette={true}
          showProperties={true}
          showToolbar={true}
          theme={theme}
          toolbarOptions={{
            showExecute: true,
            showSave: true,
            showLoad: true,
            showClear: true,
            showUndoRedo: true,
            showUISettings: true,
          }}
          onWorkflowChange={(workflow) => {
            console.log('[AsyncExecutionDemo] Workflow updated:', workflow);
          }}
          onExecute={(result) => {
            console.log('[AsyncExecutionDemo] Execution completed:', result);
          }}
          onError={(error) => {
            console.error('[AsyncExecutionDemo] Execution error:', error);
          }}
        />
      </div>
    </div>
  );
}

export default AsyncExecutionDemo;
