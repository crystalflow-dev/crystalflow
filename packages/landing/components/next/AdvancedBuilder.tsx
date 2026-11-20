'use client';

import 'reflect-metadata';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { canvasCount, resultLine, type AdvancedNodeView } from '@/lib/advancedLook';
import { advancedNodes } from '@/lib/advancedNodes';
import { advancedWorkflow, advancedWorkflowCompact } from '@/lib/advancedWorkflow';
import { useScheme } from '@/lib/useScheme';

const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false }
);

/** The example's own node: a colour mark, the name, and one line that turns into the result. */
function renderNode(data: AdvancedNodeView) {
  return (
    <div
      // the execution-* class keeps the library's own status border around the node
      className={`cf-adv-node${data.executionStatus ? ` execution-${data.executionStatus}` : ''}`}
      style={{ '--mark': data.color } as React.CSSProperties}
    >
      <span className="cf-adv-node__label">{data.label}</span>
      <span className="cf-adv-node__line">{resultLine(data)}</span>
    </div>
  );
}

/** The example's own palette entry: one line with the node's colour. */
function renderPaletteItem(item: { label: string; color?: string }) {
  return (
    <span className="cf-adv-item" style={{ '--mark': item.color } as React.CSSProperties}>
      {item.label}
    </span>
  );
}

type ToolbarActions = {
  onExecute: () => void;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onClearExecution: () => void;
  canExecute: boolean;
};

const looks = [
  {
    id: 'custom',
    label: 'Custom',
    note: 'renderToolbar, renderNodeContent, renderPaletteItem, reactFlowCustomization, onWorkflowChange',
  },
  { id: 'default', label: 'Default', note: 'no styling props' },
] as const;

export default function AdvancedBuilder() {
  const scheme = useScheme();
  const [look, setLook] = useState<(typeof looks)[number]['id']>('custom');
  const [count, setCount] = useState('');
  // a phone has room for the canvas only: the palette and the property panel would cover it
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const read = () => setCompact(media.matches);
    read();
    media.addEventListener('change', read);
    return () => media.removeEventListener('change', read);
  }, []);
  const custom = look === 'custom';

  const onWorkflowChange = useCallback(
    (nodes: unknown[], edges: unknown[]) => setCount(canvasCount(nodes.length, edges.length)),
    []
  );
  // the example's own toolbar, built on the actions the builder hands over
  const renderToolbar = useCallback(
    (actions: ToolbarActions) => (
      <div className="cf-adv-bar">
        <span className="cf-adv-bar__name">Order triage</span>
        <span className="cf-adv-bar__count">{count}</span>
        <button type="button" onClick={actions.onClearExecution}>
          Reset
        </button>
        <button type="button" onClick={actions.onSave}>
          Save
        </button>
        <button type="button" onClick={actions.onLoad}>
          Load
        </button>
        <button
          type="button"
          className="cf-adv-bar__run"
          onClick={actions.onExecute}
          disabled={!actions.canExecute}
        >
          Run triage
        </button>
      </div>
    ),
    [count]
  );

  return (
    <div className="ui cf-win cf-demo__win">
      <div className="cf-win__bar">
        <span className="cf-win__file cf-adv__note">
          {looks.find((one) => one.id === look)!.note}
        </span>
        <div className="cf-demo__tabs" role="group" aria-label="Look of the builder">
          {looks.map((one) => (
            <button
              key={one.id}
              type="button"
              className="cf-win__btn"
              aria-pressed={look === one.id}
              onClick={() => setLook(one.id)}
            >
              {one.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`cf-demo__builder${custom ? ' cf-adv' : ''}`}>
        <WorkflowBuilder
          // the two looks are two builders: a node keeps the renderer it was created with
          key={look}
          nodes={advancedNodes as never}
          initialWorkflow={custom ? advancedWorkflowCompact : advancedWorkflow}
          theme={scheme}
          showJsonEditor={false}
          showPalette={!compact}
          showProperties={!compact}
          uiSettings={{ minimap: false }}
          onWorkflowChange={custom ? (onWorkflowChange as never) : undefined}
          renderToolbar={custom ? renderToolbar : undefined}
          renderNodeContent={custom ? (renderNode as never) : undefined}
          renderPaletteItem={custom ? (renderPaletteItem as never) : undefined}
          reactFlowCustomization={{
            reactFlowProps: {
              fitView: true,
              fitViewOptions: { padding: 0.15, maxZoom: 1 },
              ...(custom ? { snapToGrid: true, snapGrid: [20, 20] } : {}),
            } as never,
            ...(custom
              ? {
                  // a ruled grid the nodes snap to, in a line colour that suits the theme
                  backgroundProps: {
                    variant: 'lines' as never,
                    gap: 40,
                    size: 1,
                    color: scheme === 'dark' ? '#26262b' : '#eceef2',
                  },
                  controlsProps: { position: 'bottom-right' as const, showInteractive: false },
                }
              : {}),
          }}
        />
      </div>
    </div>
  );
}
