'use client';

import 'reflect-metadata';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { NodeConstructor } from '@crystalflow/core';
import Code from '@/components/next/Code';
import { AddNode, AddThreeNode, NumberNode, heroWorkflow } from '@/lib/heroNodes';

const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false }
);

type Line = { text: string; kind?: 'new'; key?: boolean };

function codeLines(third: boolean): Line[] {
  return [
    { text: "@defineNode({ type: 'add', label: 'Add'," },
    { text: "              category: 'Math' })" },
    { text: 'class AddNode extends Node {' },
    { text: "  @Input({ type: 'number', label: 'A' })", key: true },
    { text: '  a = 0;' },
    { text: "  @Input({ type: 'number', label: 'B' })", key: true },
    { text: '  b = 0;' },
    ...(third
      ? ([
          { text: "  @Input({ type: 'number', label: 'C' })", kind: 'new', key: true },
          { text: '  c = 0;', kind: 'new' },
        ] as Line[])
      : []),
    { text: "  @Output({ type: 'number' })", key: true },
    { text: '  sum = 0;' },
    { text: '' },
    { text: '  execute() {' },
    {
      text: third ? '    this.sum = this.a + this.b + this.c;' : '    this.sum = this.a + this.b;',
    },
    { text: '  }' },
    { text: '}' },
  ];
}

type NodeView = {
  label?: string;
  type?: string;
  inputValue?: number;
  executionStatus?: string;
  executionOutputs?: Record<string, unknown>;
};

function renderNode(data: NodeView) {
  const isAdd = data.type !== 'number';
  const sum = data.executionOutputs?.sum;
  return (
    <div className={`cf-node${isAdd ? ' cf-node--add' : ''}`} data-status={data.executionStatus}>
      <span className="cf-node__label">{data.label}</span>
      <span className="cf-node__value">
        {isAdd ? (sum === undefined ? 'sum' : String(sum)) : String(data.inputValue ?? '')}
      </span>
    </div>
  );
}

export default function HeroDemo() {
  const [third, setThird] = useState(false);
  const nodes = useMemo(
    () => [NumberNode, AddNode, AddThreeNode] as unknown as NodeConstructor[],
    []
  );
  const workflow = useMemo(() => heroWorkflow(third), [third]);

  return (
    <div className="ui cf-win">
      <div className="cf-win__bar">
        <span className="cf-win__file">AddNode.ts</span>
        <button
          type="button"
          className="cf-win__btn"
          aria-pressed={third}
          onClick={() => setThird((v) => !v)}
        >
          {third ? 'Remove the third input' : 'Add a third input'}
        </button>
      </div>
      <pre className="cf-code" aria-label="The AddNode class">
        <code>
          {codeLines(third).map((line, i) => (
            <span
              key={`${i}-${line.text}`}
              className={`cf-line${line.kind ? ` cf-line--${line.kind}` : ''}${line.key ? ' cf-line--key' : ''}`}
            >
              {line.text ? <Code code={line.text} lang="ts" /> : ' '}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
      <div className="cf-canvas">
        <WorkflowBuilder
          key={third ? 'add3' : 'add'}
          nodes={nodes as never}
          initialWorkflow={workflow}
          theme="light"
          showPalette={false}
          showProperties={false}
          uiSettings={{ minimap: false, controls: false }}
          reactFlowCustomization={{
            reactFlowProps: {
              fitView: true,
              nodesFocusable: false,
              edgesFocusable: false,
              zoomOnScroll: false,
              panOnScroll: false,
              preventScrolling: false,
            } as never,
          }}
          renderNodeContent={renderNode as never}
          renderToolbar={(actions) => (
            <div className="cf-run">
              <button
                type="button"
                className="cf-win__btn cf-win__btn--run"
                onClick={actions.onExecute}
              >
                Run the workflow
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
