import 'reflect-metadata';
import { runEngine, type EngineEvent } from '../engineRun';

const line = (event: EngineEvent) => ('node' in event ? `${event.name} ${event.node}` : event.name);

describe('the execution example', () => {
  it('runs the four nodes in order on the real executor and reports each event', async () => {
    const events: EngineEvent[] = [];
    const status = await runEngine({ onEvent: (event) => events.push(event) });

    expect(status).toBe('success');
    expect(events.map(line)).toEqual([
      'beforeExecute',
      'onNodeStart fetch',
      'onNodeComplete fetch',
      'onNodeStart paid',
      'onNodeComplete paid',
      'onNodeStart sum',
      'onNodeComplete sum',
      'onNodeStart report',
      'onNodeComplete report',
      'afterExecute',
    ]);
    const outputs = events.flatMap((event) =>
      event.name === 'onNodeComplete' ? event.output : []
    );
    expect(outputs).toEqual(['3 orders', '2 orders', '165', '"Paid orders: 165"']);
  });

  it('stops before the next node when the run is cancelled', async () => {
    const events: EngineEvent[] = [];
    const controller = new AbortController();
    const status = await runEngine({
      signal: controller.signal,
      delay: 5,
      onEvent: (event) => {
        events.push(event);
        if (event.name === 'onNodeStart' && event.node === 'paid') controller.abort();
      },
    });

    expect(status).toBe('cancelled');
    const lines = events.map(line);
    expect(lines).toContain('onNodeComplete paid');
    expect(lines).not.toContain('onNodeStart sum');
    expect(lines.slice(-2)).toEqual(['onCancellation', 'afterExecute']);
  });
});
