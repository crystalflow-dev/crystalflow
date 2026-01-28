/**
 * AsyncEventEmitter - A custom event emitter that supports async event listeners
 *
 * Unlike Node.js EventEmitter which executes listeners synchronously,
 * this implementation waits for all listeners (including async ones) to complete
 * before continuing execution.
 *
 * @example
 * ```typescript
 * interface MyEvents {
 *   start: (id: string) => void | Promise<void>;
 *   complete: (result: unknown) => void | Promise<void>;
 * }
 *
 * const emitter = new AsyncEventEmitter<MyEvents>();
 *
 * // Async listener
 * emitter.on('start', async (id) => {
 *   await logToDatabase(id);
 * });
 *
 * // Emit and wait for all listeners
 * await emitter.emitAsync('start', 'node-1');
 * ```
 */

type EventListener<T extends unknown[] = unknown[]> = (...args: T) => void | Promise<void>;

type EventMap = {
  [key: string]: EventListener;
};

export class AsyncEventEmitter<TEvents extends EventMap = EventMap> {
  private listeners: Map<keyof TEvents, Set<EventListener>> = new Map();

  /**
   * Register an event listener
   * @param event - Event name
   * @param listener - Event listener function (can be sync or async)
   */
  on<K extends keyof TEvents>(event: K, listener: TEvents[K]): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as EventListener);
    return this;
  }

  /**
   * Register a one-time event listener
   * @param event - Event name
   * @param listener - Event listener function (can be sync or async)
   */
  once<K extends keyof TEvents>(event: K, listener: TEvents[K]): this {
    const onceWrapper: EventListener = async (...args: unknown[]) => {
      this.off(event, onceWrapper as TEvents[K]);
      await Promise.resolve((listener as EventListener)(...args));
    };
    return this.on(event, onceWrapper as TEvents[K]);
  }

  /**
   * Remove an event listener
   * @param event - Event name
   * @param listener - Event listener function to remove
   */
  off<K extends keyof TEvents>(event: K, listener: TEvents[K]): this {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener as EventListener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
    return this;
  }

  /**
   * Remove all listeners for an event, or all listeners for all events
   * @param event - Optional event name. If not provided, removes all listeners for all events
   */
  removeAllListeners<K extends keyof TEvents>(event?: K): this {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }

  /**
   * Emit an event and wait for all listeners to complete
   * @param event - Event name
   * @param args - Arguments to pass to listeners
   * @returns Promise that resolves when all listeners have completed
   */
  async emitAsync<K extends keyof TEvents>(
    event: K,
    ...args: Parameters<TEvents[K]>
  ): Promise<void> {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.size === 0) {
      return;
    }

    // Execute all listeners and collect promises
    const promises: Promise<void>[] = [];
    for (const listener of eventListeners) {
      try {
        const result = listener(...(args as unknown[]));
        // Wrap both sync and async results in Promise.resolve
        promises.push(Promise.resolve(result));
      } catch (error) {
        // If a sync listener throws, wrap it in a rejected promise
        promises.push(Promise.reject(error));
      }
    }

    // Wait for all listeners to complete
    await Promise.all(promises);
  }

  /**
   * Get the number of listeners for an event
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount<K extends keyof TEvents>(event: K): number {
    return this.listeners.get(event)?.size || 0;
  }

  /**
   * Get all listeners for an event
   * @param event - Event name
   * @returns Array of listeners
   */
  getListeners<K extends keyof TEvents>(event: K): TEvents[K][] {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? (Array.from(eventListeners) as TEvents[K][]) : [];
  }

  /**
   * Get all event names that have listeners
   * @returns Array of event names
   */
  eventNames(): (keyof TEvents)[] {
    return Array.from(this.listeners.keys());
  }
}
