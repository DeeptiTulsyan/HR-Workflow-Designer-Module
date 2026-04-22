export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
};

export const NODE_LIBRARY = [
  {
    type: NODE_TYPES.START,
    label: 'Start Node',
    accent: 'from-emerald-400/80 to-emerald-500',
    description: 'Entry point for the workflow.',
  },
  {
    type: NODE_TYPES.TASK,
    label: 'Task Node',
    accent: 'from-sky-400/80 to-blue-500',
    description: 'Human task such as collecting documents.',
  },
  {
    type: NODE_TYPES.APPROVAL,
    label: 'Approval Node',
    accent: 'from-amber-400/80 to-orange-500',
    description: 'Manager or HR approval step.',
  },
  {
    type: NODE_TYPES.AUTOMATED,
    label: 'Automated Step',
    accent: 'from-fuchsia-400/80 to-violet-500',
    description: 'System-triggered action like email or document generation.',
  },
  {
    type: NODE_TYPES.END,
    label: 'End Node',
    accent: 'from-rose-400/80 to-pink-500',
    description: 'Workflow completion state.',
  },
];

export const NODE_DEFAULTS = {
  [NODE_TYPES.START]: {
    title: 'New workflow',
    metadata: [{ id: crypto.randomUUID(), key: 'trigger', value: 'manual' }],
  },
  [NODE_TYPES.TASK]: {
    title: 'Collect employee documents',
    description: '',
    assignee: 'HR executive',
    dueDate: '',
    customFields: [],
  },
  [NODE_TYPES.APPROVAL]: {
    title: 'Manager approval',
    approverRole: 'Manager',
    autoApproveThreshold: 0,
  },
  [NODE_TYPES.AUTOMATED]: {
    title: 'Send welcome email',
    actionId: '',
    actionParams: {},
  },
  [NODE_TYPES.END]: {
    endMessage: 'Workflow completed',
    includeSummary: true,
  },
};
