import {
  serializeWorkflow,
  deserializeWorkflow,
  validateWorkflowJSON,
} from '../utils/serialization';

describe('Serialization', () => {
  describe('serializeWorkflow', () => {
    it('should serialize workflow to JSON string', () => {
      const workflow = {
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [],
        connections: [],
      };
      const result = serializeWorkflow(workflow);
      expect(typeof result).toBe('string');
      expect(JSON.parse(result)).toEqual(workflow);
    });
  });

  describe('deserializeWorkflow', () => {
    it('should deserialize valid workflow JSON', () => {
      const json = JSON.stringify({
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [],
        connections: [],
      });
      const result = deserializeWorkflow(json);
      expect(result.id).toBe('test-workflow');
      expect(result.name).toBe('Test Workflow');
    });

    it('should throw error for missing version', () => {
      const json = JSON.stringify({
        id: 'test',
        name: 'Test',
      });
      expect(() => deserializeWorkflow(json)).toThrow('Missing workflow version');
    });

    it('should throw error for missing required fields', () => {
      const json = JSON.stringify({
        version: '1.0.0',
      });
      expect(() => deserializeWorkflow(json)).toThrow(
        'Invalid workflow format: missing required fields'
      );
    });
  });

  describe('validateWorkflowJSON', () => {
    it('should validate correct workflow structure', () => {
      const data = {
        id: 'test-workflow',
        name: 'Test Workflow',
        version: '1.0.0',
        nodes: [],
        connections: [],
      };
      const result = validateWorkflowJSON(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const data = {
        id: 'test',
      };
      const result = validateWorkflowJSON(data);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-object input', () => {
      const result = validateWorkflowJSON('not an object');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Workflow data must be an object');
    });
  });
});
