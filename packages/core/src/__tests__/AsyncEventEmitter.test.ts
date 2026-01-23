import { AsyncEventEmitter } from '../utils/AsyncEventEmitter';

/**
 * Test event map
 */
interface TestEvents {
  [key: string]: (...args: any[]) => void | Promise<void>;
  test: (value: string) => void | Promise<void>;
  data: (num: number, str: string) => void | Promise<void>;
  error: () => void | Promise<void>;
}

describe('AsyncEventEmitter', () => {
  let emitter: AsyncEventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new AsyncEventEmitter<TestEvents>();
  });

  describe('Basic Event Operations', () => {
    it('should register and emit synchronous listeners', async () => {
      const listener = jest.fn();
      emitter.on('test', listener);

      await emitter.emitAsync('test', 'hello');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('hello');
    });

    it('should register and emit asynchronous listeners', async () => {
      const results: string[] = [];
      const asyncListener = jest.fn(async (value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(value);
      });

      emitter.on('test', asyncListener);
      await emitter.emitAsync('test', 'async-hello');

      expect(asyncListener).toHaveBeenCalledTimes(1);
      expect(results).toEqual(['async-hello']);
    });

    it('should handle multiple arguments', async () => {
      const listener = jest.fn();
      emitter.on('data', listener);

      await emitter.emitAsync('data', 42, 'test');

      expect(listener).toHaveBeenCalledWith(42, 'test');
    });

    it('should handle multiple listeners for the same event', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn(async (_value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 5));
      });

      emitter.on('test', listener1);
      emitter.on('test', listener2);
      emitter.on('test', listener3);

      await emitter.emitAsync('test', 'multi');

      expect(listener1).toHaveBeenCalledWith('multi');
      expect(listener2).toHaveBeenCalledWith('multi');
      expect(listener3).toHaveBeenCalledWith('multi');
    });

    it('should not throw error when emitting event with no listeners', async () => {
      await expect(emitter.emitAsync('test', 'no-listeners')).resolves.toBeUndefined();
    });
  });

  describe('Async Behavior', () => {
    it('should wait for all async listeners to complete', async () => {
      const executionOrder: string[] = [];

      emitter.on('test', async (_value) => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        executionOrder.push('listener1');
      });

      emitter.on('test', async (_value) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        executionOrder.push('listener2');
      });

      emitter.on('test', async (_value) => {
        await new Promise((resolve) => setTimeout(resolve, 20));
        executionOrder.push('listener3');
      });

      await emitter.emitAsync('test', 'wait-test');

      // All listeners should have completed
      expect(executionOrder).toHaveLength(3);
      expect(executionOrder).toContain('listener1');
      expect(executionOrder).toContain('listener2');
      expect(executionOrder).toContain('listener3');
    });

    it('should execute sync and async listeners together', async () => {
      const results: string[] = [];

      emitter.on('test', (value) => {
        results.push(`sync-${value}`);
      });

      emitter.on('test', async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(`async-${value}`);
      });

      emitter.on('test', (value) => {
        results.push(`sync2-${value}`);
      });

      await emitter.emitAsync('test', 'mixed');

      expect(results).toHaveLength(3);
      expect(results).toContain('sync-mixed');
      expect(results).toContain('async-mixed');
      expect(results).toContain('sync2-mixed');
    });
  });

  describe('Listener Management', () => {
    it('should remove a specific listener', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);

      await emitter.emitAsync('test', 'first');
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      emitter.off('test', listener1);

      await emitter.emitAsync('test', 'second');
      expect(listener1).toHaveBeenCalledTimes(1); // Still 1
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('should remove all listeners for an event', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);

      emitter.removeAllListeners('test');

      await emitter.emitAsync('test', 'removed');
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should remove all listeners for all events', async () => {
      const testListener = jest.fn();
      const dataListener = jest.fn();

      emitter.on('test', testListener);
      emitter.on('data', dataListener);

      emitter.removeAllListeners();

      await emitter.emitAsync('test', 'removed');
      await emitter.emitAsync('data', 1, 'removed');

      expect(testListener).not.toHaveBeenCalled();
      expect(dataListener).not.toHaveBeenCalled();
    });

    it('should handle once() listeners', async () => {
      const listener = jest.fn();
      emitter.once('test', listener);

      await emitter.emitAsync('test', 'first');
      await emitter.emitAsync('test', 'second');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('first');
    });

    it('should handle async once() listeners', async () => {
      const listener = jest.fn(async (_value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      emitter.once('test', listener);

      await emitter.emitAsync('test', 'first');
      await emitter.emitAsync('test', 'second');

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Listener Introspection', () => {
    it('should return correct listener count', () => {
      expect(emitter.listenerCount('test')).toBe(0);

      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test', listener1);
      expect(emitter.listenerCount('test')).toBe(1);

      emitter.on('test', listener2);
      expect(emitter.listenerCount('test')).toBe(2);

      emitter.off('test', listener1);
      expect(emitter.listenerCount('test')).toBe(1);
    });

    it('should return all listeners for an event', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);

      const listeners = emitter.getListeners('test');
      expect(listeners).toHaveLength(2);
      expect(listeners).toContain(listener1);
      expect(listeners).toContain(listener2);
    });

    it('should return empty array for event with no listeners', () => {
      const listeners = emitter.getListeners('test');
      expect(listeners).toEqual([]);
    });

    it('should return all event names', () => {
      emitter.on('test', jest.fn());
      emitter.on('data', jest.fn());

      const names = emitter.eventNames();
      expect(names).toHaveLength(2);
      expect(names).toContain('test');
      expect(names).toContain('data');
    });
  });

  describe('Error Handling', () => {
    it('should propagate synchronous listener errors', async () => {
      emitter.on('error', () => {
        throw new Error('Sync error');
      });

      await expect(emitter.emitAsync('error')).rejects.toThrow('Sync error');
    });

    it('should propagate asynchronous listener errors', async () => {
      emitter.on('error', async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('Async error');
      });

      await expect(emitter.emitAsync('error')).rejects.toThrow('Async error');
    });

    it('should reject if any listener in a group fails', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        throw new Error('Failed listener');
      });
      const listener3 = jest.fn();

      emitter.on('test', listener1);
      emitter.on('test', listener2);
      emitter.on('test', listener3);

      await expect(emitter.emitAsync('test', 'error-test')).rejects.toThrow('Failed listener');

      // All listeners should have been called despite the error
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
    });

    it('should handle multiple listener failures', async () => {
      emitter.on('error', () => {
        throw new Error('Error 1');
      });
      emitter.on('error', async () => {
        throw new Error('Error 2');
      });

      // Promise.all will reject with the first rejection
      await expect(emitter.emitAsync('error')).rejects.toThrow();
    });
  });

  describe('Chaining', () => {
    it('should support method chaining', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      const result = emitter.on('test', listener1).on('data', listener2).off('test', listener1);

      expect(result).toBe(emitter);
    });
  });
});
