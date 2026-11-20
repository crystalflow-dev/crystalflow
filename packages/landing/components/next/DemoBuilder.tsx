'use client';

import 'reflect-metadata';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import type { NodeConstructor } from '@crystalflow/core';
import {
  DisplayNode,
  ExtractFieldNode,
  FormatTextNode,
  MockAPINode,
} from '@crystalflow/examples/src/nodes';
import Code from '@/components/next/Code';
import { demoWorkflow } from '@/lib/demoWorkflow';
import {
  DisplayNodeCode,
  ExtractFieldNodeCode,
  FormatTextNodeCode,
  MockAPINodeCode,
} from '@/lib/nodeSourceCode';

const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false }
);

const files = [
  { name: 'MockAPINode.ts', code: MockAPINodeCode },
  { name: 'ExtractFieldNode.ts', code: ExtractFieldNodeCode },
  { name: 'FormatTextNode.ts', code: FormatTextNodeCode },
  { name: 'DisplayNode.ts', code: DisplayNodeCode },
];

export default function DemoBuilder() {
  const [view, setView] = useState<'builder' | 'code'>('builder');
  const [file, setFile] = useState(0);
  // a phone has room for the canvas only: the palette and the property panel would cover it
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const read = () => setCompact(media.matches);
    read();
    media.addEventListener('change', read);
    return () => media.removeEventListener('change', read);
  }, []);
  const nodes = useMemo(
    () =>
      [MockAPINode, ExtractFieldNode, FormatTextNode, DisplayNode] as unknown as NodeConstructor[],
    []
  );

  return (
    <div className="ui cf-win cf-demo__win">
      <div className="cf-win__bar">
        <div className="cf-demo__tabs">
          <button
            type="button"
            className="cf-win__btn"
            aria-pressed={view === 'builder'}
            onClick={() => setView('builder')}
          >
            Builder
          </button>
          <button
            type="button"
            className="cf-win__btn"
            aria-pressed={view === 'code'}
            onClick={() => setView('code')}
          >
            Node classes
          </button>
        </div>
      </div>
      {/* the builder stays mounted behind the code, so a workflow in progress survives a look at it */}
      <div className="cf-demo__builder" hidden={view !== 'builder'}>
        <WorkflowBuilder
          nodes={nodes as never}
          initialWorkflow={demoWorkflow}
          theme="light"
          showJsonEditor={false}
          showPalette={!compact}
          showProperties={!compact}
          uiSettings={{ minimap: !compact }}
          reactFlowCustomization={{
            reactFlowProps: {
              fitView: true,
              fitViewOptions: { padding: 0.2, maxZoom: 1 },
            } as never,
          }}
        />
      </div>
      {view === 'code' && (
        <div className="cf-demo__code">
          <div className="cf-demo__files">
            {files.map((f, i) => (
              <button
                key={f.name}
                type="button"
                className="cf-demo__file"
                aria-pressed={file === i}
                onClick={() => setFile(i)}
              >
                {f.name}
              </button>
            ))}
          </div>
          <pre
            className="cf-pane__code"
            tabIndex={0}
            aria-label={`The source of ${files[file].name}`}
          >
            <Code code={files[file].code.trim()} lang="ts" />
          </pre>
        </div>
      )}
    </div>
  );
}
