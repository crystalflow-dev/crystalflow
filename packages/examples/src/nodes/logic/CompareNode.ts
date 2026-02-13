import { defineNode, Input, Output, Node, Property } from '@crystalflow/core';

type CompareOperation = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';

/**
 * Compare two numbers and return boolean result
 */
@defineNode({
  type: 'logic.compare',
  label: 'Compare Numbers',
  category: 'Logic',
  description: 'Compare two numbers using various operators (>, >=, <, <=, ==, !=)',
})
export class CompareNode extends Node {
  @Input({ type: 'number', label: 'A', required: true })
  a: number = 0;

  @Input({ type: 'number', label: 'B', required: true })
  b: number = 0;

  @Property({
    type: 'select',
    label: 'Operation',
    defaultValue: 'gt',
    options: [
      { value: 'gt', label: '> (Greater Than)' },
      { value: 'gte', label: '>= (Greater or Equal)' },
      { value: 'lt', label: '< (Less Than)' },
      { value: 'lte', label: '<= (Less or Equal)' },
      { value: 'eq', label: '== (Equal)' },
      { value: 'neq', label: '!= (Not Equal)' },
    ],
  })
  operation: CompareOperation = 'gt';

  @Output({ type: 'boolean', label: 'Result' })
  result!: boolean;

  execute(): void {
    switch (this.operation) {
      case 'gt':
        this.result = this.a > this.b;
        break;
      case 'gte':
        this.result = this.a >= this.b;
        break;
      case 'lt':
        this.result = this.a < this.b;
        break;
      case 'lte':
        this.result = this.a <= this.b;
        break;
      case 'eq':
        this.result = this.a === this.b;
        break;
      case 'neq':
        this.result = this.a !== this.b;
        break;
    }
  }
}
