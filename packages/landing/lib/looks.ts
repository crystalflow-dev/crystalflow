/** The ways the themes section restyles one builder, each through a prop of WorkflowBuilder. */
export type Look = {
  id: 'light' | 'dark' | 'nodes';
  label: string;
  /** the prop as it is written on WorkflowBuilder */
  code: string;
  theme: 'light' | 'dark';
  /** true when the nodes are drawn by the page's own component */
  ownNodes: boolean;
};

export const looks: Look[] = [
  {
    id: 'light',
    label: 'Light',
    code: '<WorkflowBuilder theme="light" />',
    theme: 'light',
    ownNodes: false,
  },
  {
    id: 'dark',
    label: 'Dark',
    code: '<WorkflowBuilder theme="dark" />',
    theme: 'dark',
    ownNodes: false,
  },
  {
    id: 'nodes',
    label: 'Your nodes',
    code: '<WorkflowBuilder renderNodeContent={MyNode} />',
    theme: 'light',
    ownNodes: true,
  },
];
