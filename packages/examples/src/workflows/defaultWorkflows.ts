/**
 * Default workflow configurations for examples
 * These provide pre-built workflows to demonstrate functionality
 */

import { WorkflowData } from '@crystalflow/types';

/**
 * Default workflow for AsyncExecutionDemo
 * Creates a pipeline: FetchData → ProcessData → Display
 */
export const asyncExecutionWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'async-execution-demo',
  name: 'Async Execution Demo',
  nodes: [
    {
      id: 'fetch-1',
      type: 'async.fetch-data',
      position: { x: 100, y: 150 },
      data: {
        id: 'fetch-1',
        type: 'async.fetch-data',
        state: 'idle',
        data: {
          dataSource: 'users',
          simulateError: false,
        },
      },
    },
    {
      id: 'process-1',
      type: 'async.process-data',
      position: { x: 400, y: 150 },
      data: {
        id: 'process-1',
        type: 'async.process-data',
        state: 'idle',
        data: {
          operation: 'transform',
          enableLogging: true,
        },
      },
    },
    {
      id: 'display-1',
      type: 'output.display',
      position: { x: 700, y: 150 },
      data: {
        id: 'display-1',
        type: 'output.display',
        state: 'idle',
        data: {},
      },
    },
  ],
  connections: [
    {
      id: 'conn-1',
      source: { nodeId: 'fetch-1', portId: 'data' },
      target: { nodeId: 'process-1', portId: 'inputData' },
    },
    {
      id: 'conn-2',
      source: { nodeId: 'process-1', portId: 'processedData' },
      target: { nodeId: 'display-1', portId: 'value' },
    },
  ],
  metadata: {},
};

/**
 * Default workflow for SimpleWorkflow
 * Creates: NumberInput(5) + NumberInput(3) → Add → Display
 */
export const simpleWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'simple-workflow-demo',
  name: 'Simple Workflow Demo',
  nodes: [
    {
      id: 'num1',
      type: 'input.number',
      position: { x: 100, y: 100 },
      data: {
        id: 'num1',
        type: 'input.number',
        state: 'idle',
        data: {
          value: 5,
          label: 'First Number',
        },
      },
    },
    {
      id: 'num2',
      type: 'input.number',
      position: { x: 100, y: 250 },
      data: {
        id: 'num2',
        type: 'input.number',
        state: 'idle',
        data: {
          value: 3,
          label: 'Second Number',
        },
      },
    },
    {
      id: 'add-1',
      type: 'math.add',
      position: { x: 400, y: 175 },
      data: {
        id: 'add-1',
        type: 'math.add',
        state: 'idle',
        data: {},
      },
    },
    {
      id: 'display-1',
      type: 'output.display',
      position: { x: 700, y: 175 },
      data: {
        id: 'display-1',
        type: 'output.display',
        state: 'idle',
        data: {},
      },
    },
  ],
  connections: [
    {
      id: 'conn-1',
      source: { nodeId: 'num1', portId: 'value' },
      target: { nodeId: 'add-1', portId: 'a' },
    },
    {
      id: 'conn-2',
      source: { nodeId: 'num2', portId: 'value' },
      target: { nodeId: 'add-1', portId: 'b' },
    },
    {
      id: 'conn-3',
      source: { nodeId: 'add-1', portId: 'sum' },
      target: { nodeId: 'display-1', portId: 'value' },
    },
  ],
  metadata: {},
};

/**
 * Default workflow for ConditionalNodesDemo
 * Creates: NumberInput(5) → IsPositive → IfNode → Display(then/else)
 */
export const conditionalWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'conditional-workflow-demo',
  name: 'Conditional Workflow Demo',
  nodes: [
    {
      id: 'num-input',
      type: 'input.number',
      position: { x: 100, y: 200 },
      data: {
        id: 'num-input',
        type: 'input.number',
        state: 'idle',
        data: {
          value: 5,
          label: 'Test Number',
        },
      },
    },
    {
      id: 'is-positive',
      type: 'logic.is-positive',
      position: { x: 350, y: 200 },
      data: {
        id: 'is-positive',
        type: 'logic.is-positive',
        state: 'idle',
        data: {},
      },
    },
    {
      id: 'if-node',
      type: 'flow.if',
      position: { x: 600, y: 200 },
      data: {
        id: 'if-node',
        type: 'flow.if',
        state: 'idle',
        data: {},
      },
    },
    {
      id: 'display-then',
      type: 'output.display',
      position: { x: 900, y: 150 },
      data: {
        id: 'display-then',
        type: 'output.display',
        state: 'idle',
        data: {},
      },
    },
    {
      id: 'display-else',
      type: 'output.display',
      position: { x: 900, y: 300 },
      data: {
        id: 'display-else',
        type: 'output.display',
        state: 'idle',
        data: {},
      },
    },
  ],
  connections: [
    {
      id: 'conn-1',
      source: { nodeId: 'num-input', portId: 'value' },
      target: { nodeId: 'is-positive', portId: 'number' },
    },
    {
      id: 'conn-2',
      source: { nodeId: 'is-positive', portId: 'result' },
      target: { nodeId: 'if-node', portId: 'condition' },
    },
    {
      id: 'conn-3',
      source: { nodeId: 'num-input', portId: 'value' },
      target: { nodeId: 'if-node', portId: 'value' },
    },
    {
      id: 'conn-4',
      source: { nodeId: 'if-node', portId: 'then' },
      target: { nodeId: 'display-then', portId: 'value' },
    },
    {
      id: 'conn-5',
      source: { nodeId: 'if-node', portId: 'else' },
      target: { nodeId: 'display-else', portId: 'value' },
    },
  ],
  metadata: {},
};

/**
 * Default workflow for N8NStyleWorkflow
 * Creates an automation pipeline: Webhook → HTTP Request → Transform → Conditional → [Email | Slack] → Display
 */
export const n8nStyleWorkflow: WorkflowData = {
  version: '1.0.0',
  id: 'n8n-style-demo',
  name: 'API to Notification Pipeline',
  nodes: [
    {
      id: 'webhook-1',
      type: 'automation.webhook-trigger',
      position: { x: 100, y: 200 },
      data: {
        id: 'webhook-1',
        type: 'automation.webhook-trigger',
        state: 'idle',
        data: {
          method: 'POST',
          path: '/webhook',
        },
      },
    },
    {
      id: 'http-1',
      type: 'automation.http-request',
      position: { x: 350, y: 200 },
      data: {
        id: 'http-1',
        type: 'automation.http-request',
        state: 'idle',
        data: {
          method: 'GET',
          url: 'https://api.example.com/data',
          sendBody: false,
        },
      },
    },
    {
      id: 'transform-1',
      type: 'automation.data-transform',
      position: { x: 600, y: 200 },
      data: {
        id: 'transform-1',
        type: 'automation.data-transform',
        state: 'idle',
        data: {
          operation: 'extract',
          fieldPath: 'data.items',
        },
      },
    },
    {
      id: 'if-1',
      type: 'automation.conditional-split',
      position: { x: 850, y: 200 },
      data: {
        id: 'if-1',
        type: 'automation.conditional-split',
        state: 'idle',
        data: {
          conditionType: 'equals',
          fieldToCheck: 'success',
          compareValue: 'true',
        },
      },
    },
    {
      id: 'email-1',
      type: 'automation.send-email',
      position: { x: 1100, y: 100 },
      data: {
        id: 'email-1',
        type: 'automation.send-email',
        state: 'idle',
        data: {
          to: 'success@example.com',
          subject: 'API Success',
          defaultBody: 'The API request was successful!',
        },
      },
    },
    {
      id: 'slack-1',
      type: 'automation.slack-message',
      position: { x: 1100, y: 300 },
      data: {
        id: 'slack-1',
        type: 'automation.slack-message',
        state: 'idle',
        data: {
          channel: '#alerts',
          botName: 'Alert Bot',
          defaultMessage: 'API request failed - check logs',
          includeTimestamp: true,
        },
      },
    },
    {
      id: 'display-1',
      type: 'output.display',
      position: { x: 1400, y: 200 },
      data: {
        id: 'display-1',
        type: 'output.display',
        state: 'idle',
        data: {},
      },
    },
  ],
  connections: [
    {
      id: 'conn-1',
      source: { nodeId: 'webhook-1', portId: 'body' },
      target: { nodeId: 'http-1', portId: 'body' },
    },
    {
      id: 'conn-2',
      source: { nodeId: 'http-1', portId: 'response' },
      target: { nodeId: 'transform-1', portId: 'data' },
    },
    {
      id: 'conn-3',
      source: { nodeId: 'transform-1', portId: 'result' },
      target: { nodeId: 'if-1', portId: 'inputData' },
    },
    {
      id: 'conn-4',
      source: { nodeId: 'if-1', portId: 'trueBranch' },
      target: { nodeId: 'email-1', portId: 'bodyInput' },
    },
    {
      id: 'conn-5',
      source: { nodeId: 'if-1', portId: 'falseBranch' },
      target: { nodeId: 'slack-1', portId: 'messageInput' },
    },
    {
      id: 'conn-6',
      source: { nodeId: 'email-1', portId: 'messageId' },
      target: { nodeId: 'display-1', portId: 'value' },
    },
    {
      id: 'conn-7',
      source: { nodeId: 'slack-1', portId: 'timestamp' },
      target: { nodeId: 'display-1', portId: 'value' },
    },
  ],
  metadata: {},
};
