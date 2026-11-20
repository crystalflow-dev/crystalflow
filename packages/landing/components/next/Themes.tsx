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
import { looks } from '@/lib/looks';

const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false }
);

type NodeView = { label?: string; type?: string; executionStatus?: string };

/** The page's own node: a name and its type on one line, in place of the built-in header and body. */
function MyNode(data: NodeView) {
  return (
    <div className="cf-look" data-status={data.executionStatus}>
      <span className="cf-look__label">{data.label}</span>
      <span className="cf-look__type">{data.type}</span>
    </div>
  );
}

export default function Themes() {
  const [chosen, setChosen] = useState(1);
  // a phone has room for the canvas only
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
  const look = looks[chosen];

  return (
    <section className="section" id="themes" aria-labelledby="themes-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="themes-h">
            The editor takes your look. <span className="muted">Each change is one prop.</span>
          </h2>
          <p>
            Light and dark themes are built in. A render prop replaces the body of every node with a
            component of your own.
          </p>
        </div>
        <div className="fill">
          <div className="ui cf-win cf-themes">
            <div className="cf-win__bar">
              <span className="cf-win__file">
                <Code code={look.code} lang="ts" />
              </span>
              <div className="cf-demo__tabs" role="group" aria-label="Look of the editor">
                {looks.map((option, i) => (
                  <button
                    key={option.id}
                    type="button"
                    className="cf-win__btn"
                    aria-pressed={chosen === i}
                    onClick={() => setChosen(i)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="cf-themes__builder">
              <WorkflowBuilder
                nodes={nodes as never}
                initialWorkflow={demoWorkflow}
                key={look.ownNodes ? 'own' : 'built-in'}
                theme={look.theme}
                renderNodeContent={look.ownNodes ? (MyNode as never) : undefined}
                showToolbar={false}
                showJsonEditor={false}
                showProperties={false}
                showPalette={!compact}
                uiSettings={{ minimap: false, controls: !compact }}
                reactFlowCustomization={{
                  reactFlowProps: {
                    fitView: true,
                    fitViewOptions: { padding: 0.25, maxZoom: 1 },
                    zoomOnScroll: false,
                    panOnScroll: false,
                    preventScrolling: false,
                  } as never,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
