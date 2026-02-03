/**
 * @jest-environment jsdom
 */
import * as ReactFloReact from '../index';

describe('@reactflo/react', () => {
  it('should export types', () => {
    expect(ReactFloReact).toBeDefined();
  });
});
