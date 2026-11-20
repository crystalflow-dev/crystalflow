import { looks } from '../looks';

describe('the looks of the themes section', () => {
  it("offers the two built-in themes and one look with the page's own nodes", () => {
    expect(looks.map((look) => [look.id, look.theme, look.ownNodes])).toEqual([
      ['light', 'light', false],
      ['dark', 'dark', false],
      ['nodes', 'light', true],
    ]);
  });

  it('shows each look as the prop a reader would write', () => {
    for (const look of looks) expect(look.code).toMatch(/^<WorkflowBuilder \w+=.+ \/>$/);
    expect(looks[2].code).toContain('renderNodeContent');
  });
});
