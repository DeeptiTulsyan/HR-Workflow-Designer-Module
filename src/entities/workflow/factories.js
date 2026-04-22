import { NODE_DEFAULTS, NODE_LIBRARY, NODE_TYPES } from './constants';

let nodeCounter = 2;

function getNodeVisual(type) {
  return NODE_LIBRARY.find((item) => item.type === type);
}

export function createNodeFromType(type, position = { x: 120, y: 120 }) {
  const visual = getNodeVisual(type);
  const id = `node_${nodeCounter++}`;

  return {
    id,
    type,
    position,
    data: {
      ...structuredClone(NODE_DEFAULTS[type]),
      label: visual.label,
      accent: visual.accent,
      type,
    },
  };
}

export function createInitialWorkflowNodes() {
  return [
    {
      id: 'node_1',
      type: NODE_TYPES.START,
      position: { x: 80, y: 80 },
      data: {
        ...structuredClone(NODE_DEFAULTS[NODE_TYPES.START]),
        label: 'Start Node',
        accent: 'from-emerald-400/80 to-emerald-500',
        type: NODE_TYPES.START,
      },
    },
  ];
}
