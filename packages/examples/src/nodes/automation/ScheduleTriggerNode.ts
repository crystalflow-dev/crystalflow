import { Node, Output, Property, defineNode } from '@reactflo/core';

/**
 * Schedule Trigger Node - Triggers workflow on a schedule
 */
@defineNode({
  type: 'automation.schedule-trigger',
  label: 'Schedule',
  category: 'Trigger',
  description: 'Triggers workflow on a schedule (cron)',
  color: '#FF6D5A',
})
export class ScheduleTriggerNode extends Node {
  @Property({
    type: 'select',
    label: 'Interval',
    defaultValue: 'hourly',
    options: [
      { value: 'minute', label: 'Every Minute' },
      { value: 'hourly', label: 'Every Hour' },
      { value: 'daily', label: 'Every Day' },
      { value: 'weekly', label: 'Every Week' },
      { value: 'monthly', label: 'Every Month' },
    ],
  })
  interval: string = 'hourly';

  @Property({
    type: 'number',
    label: 'Hour (0-23)',
    defaultValue: 9,
    min: 0,
    max: 23,
  })
  hour: number = 9;

  @Property({
    type: 'number',
    label: 'Minute (0-59)',
    defaultValue: 0,
    min: 0,
    max: 59,
  })
  minute: number = 0;

  @Output({ type: 'string', label: 'Trigger Time' })
  triggerTime: string = '';

  @Output({ type: 'object', label: 'Event' })
  event: any;

  execute() {
    // Simulate schedule trigger
    this.triggerTime = new Date().toISOString();
    this.event = {
      type: 'scheduled',
      interval: this.interval,
      scheduledAt: this.triggerTime,
      nextRun: this.calculateNextRun(),
    };
  }

  private calculateNextRun(): string {
    const now = new Date();
    const next = new Date(now);

    switch (this.interval) {
      case 'minute':
        next.setMinutes(now.getMinutes() + 1);
        break;
      case 'hourly':
        next.setHours(now.getHours() + 1);
        break;
      case 'daily':
        next.setDate(now.getDate() + 1);
        next.setHours(this.hour);
        next.setMinutes(this.minute);
        break;
      case 'weekly':
        next.setDate(now.getDate() + 7);
        next.setHours(this.hour);
        next.setMinutes(this.minute);
        break;
      case 'monthly':
        next.setMonth(now.getMonth() + 1);
        next.setHours(this.hour);
        next.setMinutes(this.minute);
        break;
    }

    return next.toISOString();
  }
}
