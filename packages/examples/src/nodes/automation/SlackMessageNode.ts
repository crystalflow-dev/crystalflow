import { Node, Input, Output, Property, defineNode } from '@crystalflow/core';

/**
 * Slack Message Node - Sends messages to Slack channels
 */
@defineNode({
  type: 'automation.slack-message',
  label: 'Slack',
  category: 'Action',
  description: 'Sends messages to Slack channels',
  color: '#611F69',
})
export class SlackMessageNode extends Node {
  @Property({
    type: 'string',
    label: 'Channel',
    defaultValue: '#general',
    description: 'Slack channel name',
  })
  channel: string = '#general';

  @Property({
    type: 'string',
    label: 'Bot Name',
    defaultValue: 'Workflow Bot',
  })
  botName: string = 'Workflow Bot';

  @Input({ type: 'string', label: 'Message', required: false })
  messageInput?: string;

  @Property({
    type: 'string',
    label: 'Default Message',
    defaultValue: 'Hello from your workflow! 👋',
  })
  defaultMessage: string = 'Hello from your workflow! 👋';

  @Property({
    type: 'boolean',
    label: 'Include Timestamp',
    defaultValue: true,
  })
  includeTimestamp: boolean = true;

  @Output({ type: 'boolean', label: 'Success' })
  success: boolean = false;

  @Output({ type: 'string', label: 'Timestamp' })
  timestamp: string = '';

  execute() {
    const message = this.messageInput || this.defaultMessage;
    const fullMessage = this.includeTimestamp
      ? `${message}\n_Sent at ${new Date().toLocaleTimeString()}_`
      : message;

    // Simulate sending to Slack
    this.success = true;
    this.timestamp = Date.now().toString();

    console.log(`💬 Slack message sent to ${this.channel}`);
    console.log(`   From: ${this.botName}`);
    console.log(`   Message: ${fullMessage}`);
  }
}
