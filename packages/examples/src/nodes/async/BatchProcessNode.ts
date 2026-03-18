import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Batch Process Node - Simulates processing items in batches
 * Useful for testing execution visualization with chunked operations
 */
@defineNode({
  type: 'async.batch-process',
  label: 'Batch Process',
  category: 'Async',
  description: 'Processes items in batches with delays between each batch',
  color: '#E91E63',
})
export class BatchProcessNode extends Node {
  @Property({
    type: 'number',
    label: 'Batch Size',
    defaultValue: 3,
    min: 1,
    max: 20,
    step: 1,
    description: 'Number of items to process in each batch',
  })
  batchSize: number = 3;

  @Property({
    type: 'number',
    label: 'Batch Delay (ms)',
    defaultValue: 800,
    min: 100,
    max: 5000,
    step: 100,
    description: 'Delay between processing each batch',
  })
  batchDelay: number = 800;

  @Input({ type: 'any', label: 'Items', required: true })
  items: any;

  @Output({ type: 'array', label: 'Processed Items' })
  processedItems: any[] = [];

  @Output({ type: 'object', label: 'Stats' })
  stats: any = {};

  async execute() {
    const startTime = Date.now();
    let itemsArray: any[] = [];

    // Extract array from input
    if (Array.isArray(this.items)) {
      itemsArray = this.items;
    } else if (typeof this.items === 'object' && this.items !== null) {
      // Try to find an array property
      const arrayProp = Object.keys(this.items).find((key) => Array.isArray(this.items[key]));
      if (arrayProp) {
        itemsArray = this.items[arrayProp];
      } else {
        // Wrap single object in array
        itemsArray = [this.items];
      }
    } else {
      itemsArray = [this.items];
    }

    const totalItems = itemsArray.length;
    const totalBatches = Math.ceil(totalItems / this.batchSize);
    const results: any[] = [];

    // Process in batches
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      // Check for cancellation between batches
      this.checkCancellation();

      const start = batchIndex * this.batchSize;
      const end = Math.min(start + this.batchSize, totalItems);
      const batch = itemsArray.slice(start, end);

      // Process batch (simulate work)
      const processedBatch = batch.map((item, index) => ({
        ...item,
        batchId: batchIndex + 1,
        batchIndex: index,
        processedAt: new Date().toISOString(),
      }));

      results.push(...processedBatch);

      // Delay between batches (except after last batch)
      if (batchIndex < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, this.batchDelay));
      }
    }

    const endTime = Date.now();

    this.processedItems = results;
    this.stats = {
      totalItems,
      totalBatches,
      batchSize: this.batchSize,
      processingTime: endTime - startTime,
      avgTimePerBatch: (endTime - startTime) / totalBatches,
      timestamp: new Date().toISOString(),
    };
  }
}
