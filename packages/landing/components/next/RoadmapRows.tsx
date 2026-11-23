const GITHUB = 'https://github.com/crystalflow-dev/crystalflow';

type Phase = { name: string; line: string; status: 'Done' | 'In progress' | 'Planned' };

const built: Phase[] = [
  {
    name: 'Node system',
    line: 'The Node base class, the decorators and the node registry.',
    status: 'Done',
  },
  {
    name: 'Workflow system',
    line: 'Connection validation, topological sorting and JSON serialization.',
    status: 'Done',
  },
  {
    name: 'Execution engine',
    line: 'Async execution with events, cancellation and error handling.',
    status: 'Done',
  },
  {
    name: 'React package',
    line: 'The visual builder, the property panel and the examples.',
    status: 'In progress',
  },
];

const planned: Phase[] = [
  {
    name: 'Type system',
    line: 'A DataType class, a type validator and a library of built-in types.',
    status: 'Planned',
  },
  {
    name: 'Developer tools',
    line: 'A CLI for scaffolding, node templates and a VS Code extension.',
    status: 'Planned',
  },
  {
    name: 'Node libraries',
    line: 'Official node sets, tutorials and example applications.',
    status: 'Planned',
  },
  {
    name: 'Server-side execution',
    line: 'A server package with a REST API, event streaming and persistence.',
    status: 'Planned',
  },
];

function Rows({ phases }: { phases: Phase[] }) {
  return (
    <ul className="rows span-6">
      {phases.map((phase) => (
        <li key={phase.name}>
          <span className="rows__name">{phase.name}</span>
          <p>{phase.line}</p>
          <span className="rows__value cf-status" data-status={phase.status}>
            {phase.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function RoadmapRows() {
  return (
    <section className="section" id="roadmap" aria-labelledby="roadmap-h">
      <div className="wrap">
        <div className="section-head section-head--row">
          <div>
            <h2 id="roadmap-h">
              Roadmap to version 1.0.{' '}
              <span className="muted">The engine is built and the editor is close.</span>
            </h2>
          </div>
          <a className="link" href={`${GITHUB}/issues`}>
            Pick up an issue on GitHub
          </a>
        </div>
        <div className="grid grid--top">
          <Rows phases={built} />
          <Rows phases={planned} />
        </div>
      </div>
    </section>
  );
}
