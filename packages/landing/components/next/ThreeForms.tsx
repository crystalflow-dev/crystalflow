'use client';

import { useEffect, useRef, useState } from 'react';
import Code from '@/components/next/Code';
import type { Lang } from '@/lib/highlight';

const classCode = `class AddNode extends Node {
  @Input({ type: 'number' })
  a = 0;
  @Input({ type: 'number' })
  b = 0;
  @Output({ type: 'number' })
  sum = 0;

  execute() {
    this.sum = this.a + this.b;
  }
}`;

const jsonCode = `{
  "name": "Add",
  "nodes": [
    { "id": "n1", "type": "number" },
    { "id": "n2", "type": "number" },
    { "id": "add", "type": "add" }
  ],
  "connections": [
    { "source": { "nodeId": "n1",
                  "portId": "value" },
      "target": { "nodeId": "add",
                  "portId": "a" } },
    { "source": { "nodeId": "n2",
                  "portId": "value" },
      "target": { "nodeId": "add",
                  "portId": "b" } }
  ]
}`;

function Pane({
  file,
  label,
  lang,
  children,
}: {
  file: string;
  label: string;
  lang: Lang;
  children: string;
}) {
  return (
    <div className="ui cf-pane" role="img" aria-label={label}>
      <div className="cf-pane__bar" aria-hidden="true">
        {file}
      </div>
      <pre className="cf-pane__code" aria-hidden="true">
        <Code code={children} lang={lang} />
      </pre>
    </div>
  );
}

function CanvasPane() {
  return (
    <div
      className="ui cf-pane"
      role="img"
      aria-label="Two Number nodes, 5 and 3, wired into an Add node on the canvas"
    >
      <div className="cf-pane__bar" aria-hidden="true">
        WorkflowBuilder
      </div>
      <svg className="cf-pane__canvas" viewBox="0 0 400 240" aria-hidden="true">
        <defs>
          <pattern id="cf-dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" />
          </pattern>
        </defs>
        <rect className="cf-pane__dots" width="400" height="240" fill="url(#cf-dots)" />
        <path className="cf-pane__edge" d="M150 62 C190 62 190 112 230 112" />
        <path className="cf-pane__edge" d="M150 178 C190 178 190 128 230 128" />
        <g className="cf-pane__node">
          <rect x="30" y="40" width="120" height="44" rx="6" />
          <text x="44" y="67">
            Number
          </text>
          <text className="cf-pane__val" x="136" y="67" textAnchor="end">
            5
          </text>
        </g>
        <g className="cf-pane__node">
          <rect x="30" y="156" width="120" height="44" rx="6" />
          <text x="44" y="183">
            Number
          </text>
          <text className="cf-pane__val" x="136" y="183" textAnchor="end">
            3
          </text>
        </g>
        <g className="cf-pane__node cf-pane__node--on">
          <rect x="230" y="98" width="130" height="44" rx="6" />
          <text x="244" y="125">
            Add
          </text>
          <text className="cf-pane__val" x="346" y="125" textAnchor="end">
            8
          </text>
        </g>
        <g className="cf-pane__port">
          <circle cx="150" cy="62" r="4" />
          <circle cx="150" cy="178" r="4" />
          <circle cx="230" cy="112" r="4" />
          <circle cx="230" cy="128" r="4" />
          <circle cx="360" cy="120" r="4" />
        </g>
      </svg>
    </div>
  );
}

const forms = [
  {
    title: 'A TypeScript class',
    line: 'Decorators declare the ports and the settings of a node. Its execute method holds the logic, typed like the rest of your code.',
  },
  {
    title: 'A node on the canvas',
    line: 'The React package reads the same decorators and draws the node, its ports and its property panel. People wire nodes together by dragging.',
  },
  {
    title: 'A JSON document',
    line: 'The graph saves to JSON and loads back from it, so a workflow fits in a database row, an API response or a pull request.',
  },
];

function FormPane({ index }: { index: number }) {
  if (index === 0) {
    return (
      <Pane file="AddNode.ts" lang="ts" label="The AddNode class with two inputs and one output">
        {classCode}
      </Pane>
    );
  }
  if (index === 1) return <CanvasPane />;
  return (
    <Pane file="add.workflow.json" lang="json" label="The same workflow saved as JSON">
      {jsonCode}
    </Pane>
  );
}

const PINNED =
  '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';

export default function ThreeForms() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = window.matchMedia(PINNED);
    let frame = 0;
    const read = () => {
      frame = 0;
      if (!media.matches) return;
      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
      const position = Math.min(forms.length - 0.0001, progress * forms.length);
      setActive(Math.floor(position));
      setFill(position - Math.floor(position));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const choose = (index: number) => {
    const section = sectionRef.current;
    if (!section || !window.matchMedia(PINNED).matches) {
      setActive(index);
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((index + 0.5) / forms.length) * travel, behavior: 'smooth' });
  };

  return (
    <section className="section" id="workflow" aria-labelledby="workflow-h" ref={sectionRef}>
      <div className="wrap">
        <div className="section-head">
          <h2 id="workflow-h">One workflow in three forms</h2>
        </div>
        <div className="grid grid--top fill">
          <ol className="cf-forms span-5">
            {forms.map((form, i) => (
              <li key={form.title}>
                <button
                  type="button"
                  className="cf-forms__step"
                  aria-pressed={active === i}
                  data-done={i < active ? '' : undefined}
                  style={
                    active === i
                      ? ({ '--cf-fill': fill.toFixed(3) } as React.CSSProperties)
                      : undefined
                  }
                  onClick={() => choose(i)}
                >
                  <span className="cf-forms__title">{form.title}</span>
                  <span className="cf-forms__line">{form.line}</span>
                </button>
                <div className="cf-forms__inline">
                  <FormPane index={i} />
                </div>
              </li>
            ))}
          </ol>
          <div className="cf-forms__frame span-6 start-7">
            {forms.map((form, i) => (
              <div
                key={form.title}
                className="cf-forms__pane"
                data-on={active === i ? '' : undefined}
              >
                <FormPane index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
