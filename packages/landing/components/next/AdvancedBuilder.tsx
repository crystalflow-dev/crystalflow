'use client';

import 'reflect-metadata';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { advancedNodes } from '@/lib/advancedNodes';
import { advancedWorkflow } from '@/lib/advancedWorkflow';
import { useScheme } from '@/lib/useScheme';

const WorkflowBuilder = dynamic(
  () => import('@crystalflow/react').then((mod) => mod.WorkflowBuilder),
  { ssr: false }
);

export default function AdvancedBuilder() {
  const scheme = useScheme();
  // a phone has room for the canvas only: the palette and the property panel would cover it
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const read = () => setCompact(media.matches);
    read();
    media.addEventListener('change', read);
    return () => media.removeEventListener('change', read);
  }, []);

  return (
    <div className="ui cf-win cf-demo__win">
      <div className="cf-demo__builder">
        <WorkflowBuilder
          nodes={advancedNodes as never}
          initialWorkflow={advancedWorkflow}
          theme={scheme}
          showJsonEditor={false}
          showPalette={!compact}
          showProperties={!compact}
          uiSettings={{ minimap: false }}
          reactFlowCustomization={{
            reactFlowProps: {
              fitView: true,
              fitViewOptions: { padding: 0.15, maxZoom: 1 },
            } as never,
          }}
        />
      </div>
    </div>
  );
}
