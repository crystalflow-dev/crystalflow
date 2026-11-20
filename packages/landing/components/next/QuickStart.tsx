import Code from '@/components/next/Code';
import type { Lang } from '@/lib/highlight';

const steps: {
  title: string;
  line: string;
  file: string;
  lang: Lang;
  label: string;
  code: string;
}[] = [
  {
    title: 'Install the packages',
    line: 'The core engine and the React components install from npm.',
    file: 'Terminal',
    lang: 'sh',
    label: 'The npm install command for the core and React packages',
    code: `npm install @crystalflow/core \\
            @crystalflow/react`,
  },
  {
    title: 'Define a node',
    line: 'One decorated class is one node. Its ports are its fields.',
    file: 'nodes.ts',
    lang: 'ts',
    label: 'A node class with an input, an output and an execute method',
    code: `@defineNode({ type: 'shout',
              label: 'Shout',
              category: 'Text' })
class ShoutNode extends Node {
  @Input({ type: 'string' })
  text = '';
  @Output({ type: 'string' })
  loud = '';

  execute() {
    this.loud =
      this.text.toUpperCase();
  }
}`,
  },
  {
    title: 'Mount WorkflowBuilder',
    line: 'Pass your node classes to one component and the editor is on the page.',
    file: 'App.tsx',
    lang: 'ts',
    label: 'A React component that renders WorkflowBuilder with the node class',
    code: `import { WorkflowBuilder }
  from '@crystalflow/react';

export function App() {
  return (
    <WorkflowBuilder
      nodes={[ShoutNode]}
    />
  );
}`,
  },
];

export default function QuickStart() {
  return (
    <section className="section ground-surface" id="start" aria-labelledby="start-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="start-h">Set up CrystalFlow in 3 steps</h2>
        </div>
        <div className="grid">
          {steps.map((step, i) => (
            <article key={step.title} className="card card--row card--open span-4">
              <span className="step-num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.line}</p>
              <div className="cf-steppane ui cf-pane" role="img" aria-label={step.label}>
                <div className="cf-pane__bar" aria-hidden="true">
                  {step.file}
                </div>
                <pre className="cf-pane__code" aria-hidden="true">
                  <Code code={step.code} lang={step.lang} />
                </pre>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
