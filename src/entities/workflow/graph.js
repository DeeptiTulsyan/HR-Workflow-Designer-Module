export function buildAdjacency(nodes, edges) {
  const outgoing = new Map();
  const incoming = new Map();

  nodes.forEach((node) => {
    outgoing.set(node.id, []);
    incoming.set(node.id, []);
  });

  edges.forEach((edge) => {
    if (outgoing.has(edge.source)) outgoing.get(edge.source).push(edge.target);
    if (incoming.has(edge.target)) incoming.get(edge.target).push(edge.source);
  });

  return { outgoing, incoming };
}

export function detectCycle(nodes, edges) {
  const { outgoing } = buildAdjacency(nodes, edges);
  const visited = new Set();
  const active = new Set();

  function walk(nodeId) {
    if (active.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    active.add(nodeId);

    for (const nextNodeId of outgoing.get(nodeId) ?? []) {
      if (walk(nextNodeId)) return true;
    }

    active.delete(nodeId);
    return false;
  }

  return nodes.some((node) => walk(node.id));
}

export function getReachableNodeIds(startId, outgoing) {
  const seen = new Set();
  const queue = [startId];

  while (queue.length) {
    const current = queue.shift();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    for (const nextNodeId of outgoing.get(current) ?? []) queue.push(nextNodeId);
  }

  return seen;
}
