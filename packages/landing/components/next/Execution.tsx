'use client';

import 'reflect-metadata';
import { useCallback, useEffect, useRef, useState } from 'react';
import { engineSteps, runEngine, type EngineEvent, type StepId } from '@/lib/engineRun';

type Status = 'idle' | 'running' | 'done' | 'skipped';
type LogLine = { at: number; event: EngineEvent };

const idle = () =>
  Object.fromEntries(engineSteps.map((step) => [step.id, 'idle'])) as Record<StepId, Status>;

const statusText: Record<Status, string> = {
  idle: 'Waiting',
  running: 'Running',
  done: 'Done',
  skipped: 'Not run',
};

function detail(event: EngineEvent): string {
  switch (event.name) {
    case 'onNodeStart':
      return event.node;
    case 'onNodeComplete':
      return `${event.node} → ${event.output}`;
    case 'onNodeError':
      return `${event.node}: ${event.message}`;
    case 'afterExecute':
      return event.status;
    default:
      return '';
  }
}

export default function Execution() {
  const [status, setStatus] = useState(idle);
  const [outputs, setOutputs] = useState<Partial<Record<StepId, string>>>({});
  const [log, setLog] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLOListElement>(null);

  const run = useCallback(async () => {
    if (controller.current) return;
    const abort = new AbortController();
    controller.current = abort;
    const started = performance.now();
    setStatus(idle());
    setOutputs({});
    setLog([]);
    setRunning(true);
    setRan(true);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      await runEngine({
        signal: abort.signal,
        delay: still ? 0 : 650,
        onEvent: (event) => {
          setLog((lines) => [...lines, { at: Math.round(performance.now() - started), event }]);
          if (event.name === 'onNodeStart') {
            setStatus((s) => ({ ...s, [event.node]: 'running' }));
          } else if (event.name === 'onNodeComplete') {
            setStatus((s) => ({ ...s, [event.node]: 'done' }));
            setOutputs((o) => ({ ...o, [event.node]: event.output }));
          } else if (event.name === 'onCancellation') {
            setStatus(
              (s) =>
                Object.fromEntries(
                  Object.entries(s).map(([id, value]) => [id, value === 'done' ? value : 'skipped'])
                ) as Record<StepId, Status>
            );
          }
        },
      });
    } finally {
      controller.current = null;
      setRunning(false);
    }
  }, []);

  // the first run starts when the window comes on screen, so the log is never an empty box
  useEffect(() => {
    const el = windowRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void run();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [run]);

  useEffect(() => () => controller.current?.abort(), []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  return (
    <section className="section" id="engine" aria-labelledby="engine-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="engine-h">
            The engine runs the graph. <span className="muted">Every step is an event.</span>
          </h2>
          <p>
            Nodes run in dependency order, async ones included. Your code listens to each step and
            can cancel the run before the next node starts.
          </p>
        </div>
        <div className="fill">
          <div className="ui cf-win cf-engine" ref={windowRef}>
            <div className="cf-win__bar">
              <span className="cf-win__file">executor.execute(workflow)</span>
              <button
                type="button"
                className={`cf-win__btn${running ? '' : ' cf-win__btn--run'}`}
                onClick={() => (running ? controller.current?.abort() : void run())}
              >
                {running ? 'Cancel the run' : ran ? 'Run it again' : 'Run the workflow'}
              </button>
            </div>
            <div className="cf-engine__body">
              <ol className="cf-engine__nodes" aria-label="The nodes of the workflow, in run order">
                {engineSteps.map((step) => (
                  <li key={step.id} className="cf-engine__node" data-status={status[step.id]}>
                    <span className="cf-engine__dot" aria-hidden="true"></span>
                    <span className="cf-engine__label">{step.label}</span>
                    <span className="cf-engine__out">
                      {outputs[step.id] ?? statusText[status[step.id]]}
                    </span>
                  </li>
                ))}
              </ol>
              <ol
                className="cf-engine__log"
                ref={logRef}
                tabIndex={0}
                aria-label="The events the executor emitted"
              >
                {log.length === 0 && (
                  <li className="cf-engine__line cf-engine__line--hint">
                    <span></span>
                    <span>Run the workflow to see its events.</span>
                  </li>
                )}
                {log.map((line, i) => (
                  <li key={i} className="cf-engine__line" data-event={line.event.name}>
                    <span className="cf-engine__at">+{line.at} ms</span>
                    <span>
                      <span className="cf-engine__name">{line.event.name}</span>{' '}
                      <span className="cf-engine__detail">{detail(line.event)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
