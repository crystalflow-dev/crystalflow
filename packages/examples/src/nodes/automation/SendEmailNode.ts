import { Node, Input, Output, Property, defineNode } from '@reactflo/core';

/**
 * Send Email Node - Sends emails via SMTP or email service
 */
@defineNode({
  type: 'automation.send-email',
  label: 'Send Email',
  category: 'Action',
  description: 'Sends email notifications',
  color: '#7B68EE',
})
export class SendEmailNode extends Node {
  @Property({
    type: 'string',
    label: 'To',
    defaultValue: 'recipient@example.com',
    description: 'Recipient email address',
  })
  to: string = 'recipient@example.com';

  @Property({
    type: 'string',
    label: 'Subject',
    defaultValue: 'Notification from Workflow',
  })
  subject: string = 'Notification from Workflow';

  @Input({ type: 'string', label: 'Body', required: false })
  bodyInput?: string;

  @Property({
    type: 'string',
    label: 'Default Body',
    defaultValue: 'This is an automated message from your workflow.',
  })
  defaultBody: string = 'This is an automated message from your workflow.';

  @Output({ type: 'boolean', label: 'Success' })
  success: boolean = false;

  @Output({ type: 'string', label: 'Message ID' })
  messageId: string = '';

  execute() {
    const emailBody = this.bodyInput || this.defaultBody;

    // Simulate sending email
    this.success = true;
    this.messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`📧 Email sent to ${this.to}`);
    console.log(`   Subject: ${this.subject}`);
    console.log(`   Body: ${emailBody.substring(0, 50)}...`);
    console.log(`   Message ID: ${this.messageId}`);
  }
}
