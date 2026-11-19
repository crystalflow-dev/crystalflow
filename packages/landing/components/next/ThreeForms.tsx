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

function Pane({ file, label, children }: { file: string; label: string; children: string }) {
  return (
    <div className="ui cf-pane" role="img" aria-label={label}>
      <div className="cf-pane__bar" aria-hidden="true">
        {file}
      </div>
      <pre className="cf-pane__code" aria-hidden="true">
        {children}
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

export default function ThreeForms() {
  return (
    <section
      className="section"
      id="workflow"
      style={{ '--h': 2 } as React.CSSProperties}
      data-moment="pinned-chapters"
      aria-labelledby="workflow-h"
    >
      <div className="wrap mo-pc__grid">
        <div className="mo-pc__text">
          <h2 id="workflow-h">One workflow in three forms</h2>
          <ol className="mo-pc__steps">
            <li className="mo-pc__step">
              <h3>A TypeScript class</h3>
              <p>
                Decorators declare the ports and the settings of a node. Its execute method holds
                the logic, typed like the rest of your code.
              </p>
              <figure className="mo-pc__visual">
                <Pane file="AddNode.ts" label="The AddNode class with two inputs and one output">
                  {classCode}
                </Pane>
              </figure>
            </li>
            <li className="mo-pc__step">
              <h3>A node on the canvas</h3>
              <p>
                The React package reads the same decorators and draws the node, its ports and its
                property panel. People wire nodes together by dragging.
              </p>
              <figure className="mo-pc__visual">
                <CanvasPane />
              </figure>
            </li>
            <li className="mo-pc__step">
              <h3>A JSON document</h3>
              <p>
                The graph saves to JSON and loads back from it, so a workflow fits in a database
                row, an API response or a pull request.
              </p>
              <figure className="mo-pc__visual">
                <Pane file="add.workflow.json" label="The same workflow saved as JSON">
                  {jsonCode}
                </Pane>
              </figure>
            </li>
          </ol>
        </div>
        <div className="mo-pc__visuals frame"></div>
      </div>
    </section>
  );
}
