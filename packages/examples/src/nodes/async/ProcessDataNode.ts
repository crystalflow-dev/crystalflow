import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Process Data Node - Simulates data processing operations
 * Useful for testing execution visualization with input/output flow
 */
@defineNode({
  type: 'async.process-data',
  label: 'Process Data',
  category: 'Async',
  description: 'Simulates data processing with configurable operations',
  color: '#9C27B0',
})
export class ProcessDataNode extends Node {
  @Property({
    type: 'select',
    label: 'Operation',
    defaultValue: 'transform',
    options: [
      { value: 'transform', label: 'Transform (1s)' },
      { value: 'filter', label: 'Filter (1.5s)' },
      { value: 'aggregate', label: 'Aggregate (2s)' },
      { value: 'validate', label: 'Validate (0.5s)' },
    ],
  })
  operation: string = 'transform';

  @Property({
    type: 'boolean',
    label: 'Enable Logging',
    defaultValue: false,
    description: 'Log processing details to console',
  })
  enableLogging: boolean = false;

  @Input({ type: 'any', label: 'Input Data', required: true })
  inputData: any;

  @Output({ type: 'any', label: 'Processed Data' })
  processedData: any;

  @Output({ type: 'object', label: 'Metadata' })
  metadata: any = {};

  async execute() {
    const startTime = Date.now();

    // Simulate different processing times
    const processingTimes: Record<string, number> = {
      transform: 1000,
      filter: 1500,
      aggregate: 2000,
      validate: 500,
    };

    const processingTime = processingTimes[this.operation] || 1000;

    if (this.enableLogging) {
      console.log(`[ProcessDataNode] Starting ${this.operation} operation...`);
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // Process the data based on operation
    let result: any;
    let itemsProcessed = 0;

    if (typeof this.inputData === 'object' && this.inputData !== null) {
      if (Array.isArray(this.inputData)) {
        itemsProcessed = this.inputData.length;
        result = this.processArray(this.inputData);
      } else if (this.inputData.users && Array.isArray(this.inputData.users)) {
        itemsProcessed = this.inputData.users.length;
        result = { ...this.inputData, users: this.processArray(this.inputData.users) };
      } else if (this.inputData.products && Array.isArray(this.inputData.products)) {
        itemsProcessed = this.inputData.products.length;
        result = { ...this.inputData, products: this.processArray(this.inputData.products) };
      } else {
        itemsProcessed = 1;
        result = { ...this.inputData, processed: true, operation: this.operation };
      }
    } else {
      result = { value: this.inputData, processed: true, operation: this.operation };
      itemsProcessed = 1;
    }

    const endTime = Date.now();

    this.processedData = result;
    this.metadata = {
      operation: this.operation,
      itemsProcessed,
      processingTime: endTime - startTime,
      timestamp: new Date().toISOString(),
    };

    if (this.enableLogging) {
      console.log(
        `[ProcessDataNode] Completed ${this.operation} operation in ${endTime - startTime}ms`
      );
      console.log(`[ProcessDataNode] Processed ${itemsProcessed} items`);
    }
  }

  private processArray(arr: any[]): any[] {
    switch (this.operation) {
      case 'filter':
        // Filter out items (simulate filtering)
        return arr.filter((_, index) => index % 2 === 0);
      case 'transform':
        // Transform items (add processed flag)
        return arr.map((item) => ({ ...item, processed: true }));
      case 'aggregate':
        // Return aggregated result
        return [
          {
            totalItems: arr.length,
            summary: 'Aggregated data',
            items: arr.slice(0, 3), // Take first 3 items as sample
          },
        ];
      case 'validate':
        // Validate items (add validation flag)
        return arr.map((item) => ({ ...item, validated: true }));
      default:
        return arr;
    }
  }
}
