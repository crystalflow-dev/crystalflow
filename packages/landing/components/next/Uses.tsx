const nodes = [
  { x: 20, y: 98, w: 104, label: 'Webhook' },
  { x: 160, y: 98, w: 124, label: 'HTTP Request' },
  { x: 320, y: 98, w: 60, label: 'IF' },
  { x: 416, y: 40, w: 104, label: 'Slack' },
  { x: 416, y: 156, w: 104, label: 'Email' },
];

function AutomationCanvas() {
  return (
    <svg className="cf-pane__canvas" viewBox="0 0 540 240" aria-hidden="true">
      <path className="cf-pane__edge" d="M124 120 H160" />
      <path className="cf-pane__edge" d="M284 120 H320" />
      <path className="cf-pane__edge" d="M380 110 C398 110 398 62 416 62" />
      <path className="cf-pane__edge" d="M380 130 C398 130 398 178 416 178" />
      {nodes.map((n) => (
        <g key={n.label} className={`cf-pane__node${n.label === 'IF' ? ' cf-pane__node--on' : ''}`}>
          <rect x={n.x} y={n.y} width={n.w} height="44" rx="6" />
          <text x={n.x + n.w / 2} y={n.y + 27} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
      <g className="cf-pane__port">
        <circle cx="124" cy="120" r="4" />
        <circle cx="160" cy="120" r="4" />
        <circle cx="284" cy="120" r="4" />
        <circle cx="320" cy="120" r="4" />
        <circle cx="380" cy="110" r="4" />
        <circle cx="380" cy="130" r="4" />
        <circle cx="416" cy="62" r="4" />
        <circle cx="416" cy="178" r="4" />
      </g>
    </svg>
  );
}

const uses = [
  {
    name: 'Automation tools',
    line: 'Triggers, HTTP requests, conditions and messages as nodes. The repository ships this one as an example.',
  },
  {
    name: 'AI agent builders',
    line: 'Model calls, tools and retrieval become nodes that your users wire together.',
  },
  {
    name: 'Data pipelines',
    line: 'Fetch, transform and route records one step at a time, with async nodes.',
  },
  {
    name: 'Approval flows',
    line: 'A business team changes the rules on a canvas, and your code stays the same.',
  },
];

export default function Uses() {
  return (
    <section className="section" id="uses" aria-labelledby="uses-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="uses-h">
            Workflow tools you can build. <span className="muted">You write the nodes.</span>
          </h2>
        </div>
        <div className="grid grid--top fill">
          <ul className="rows span-6">
            {uses.map((use) => (
              <li key={use.name}>
                <span className="rows__name">{use.name}</span>
                <p>{use.line}</p>
              </li>
            ))}
          </ul>
          <div className="frame frame--fill span-6 start-7 cf-usesframe">
            <div
              className="ui cf-pane"
              role="img"
              aria-label="An automation workflow: a webhook, an HTTP request and an IF node that branches to Slack or email"
            >
              <div className="cf-pane__bar" aria-hidden="true">
                N8NStyleWorkflow.tsx
              </div>
              <AutomationCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
