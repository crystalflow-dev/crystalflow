import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

/**
 * Conditional Split Node - Routes data based on conditions
 */
@defineNode({
  type: 'automation.conditional-split',
  label: 'IF',
  category: 'Logic',
  description: 'Routes data based on conditions',
  color: '#10B981',
})
export class ConditionalSplitNode extends Node {
  @Property({
    type: 'select',
    label: 'Condition Type',
    defaultValue: 'equals',
    options: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'greater', label: 'Greater Than' },
      { value: 'less', label: 'Less Than' },
      { value: 'exists', label: 'Field Exists' },
    ],
  })
  conditionType: string = 'equals';

  @Property({
    type: 'string',
    label: 'Field to Check',
    defaultValue: 'status',
  })
  fieldToCheck: string = 'status';

  @Property({
    type: 'string',
    label: 'Value to Compare',
    defaultValue: 'success',
  })
  compareValue: string = 'success';

  @Input({ type: 'object', label: 'Input Data' })
  inputData: any;

  @Output({ type: 'object', label: 'True Branch' })
  trueBranch: any;

  @Output({ type: 'object', label: 'False Branch' })
  falseBranch: any;

  execute() {
    if (!this.inputData) {
      this.falseBranch = null;
      return;
    }

    const fieldValue = this.getFieldValue(this.inputData, this.fieldToCheck);
    let conditionMet = false;

    switch (this.conditionType) {
      case 'equals':
        conditionMet = String(fieldValue) === this.compareValue;
        break;
      case 'contains':
        conditionMet = String(fieldValue).includes(this.compareValue);
        break;
      case 'greater':
        conditionMet = Number(fieldValue) > Number(this.compareValue);
        break;
      case 'less':
        conditionMet = Number(fieldValue) < Number(this.compareValue);
        break;
      case 'exists':
        conditionMet = fieldValue !== undefined;
        break;
    }

    if (conditionMet) {
      this.trueBranch = this.inputData;
      this.falseBranch = null;
    } else {
      this.trueBranch = null;
      this.falseBranch = this.inputData;
    }
  }

  private getFieldValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }
}
