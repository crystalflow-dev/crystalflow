/**
 * @jest-environment jsdom
 */
import * as CrystalFlowReact from '../index';

describe('@crystalflow/react', () => {
  it('should export types', () => {
    expect(CrystalFlowReact).toBeDefined();
  });
});
