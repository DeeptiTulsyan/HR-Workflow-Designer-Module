import { NODE_TYPES } from '../../entities/workflow/constants';
import { buildAdjacency } from '../../entities/workflow/graph';

const AUTOMATIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAutomations() {
  await wait(250);
  return AUTOMATIONS;
}

function describeNode(node) {
  if (node.type === NODE_TYPES.START) return `Workflow started: ${node.data.title}`;
  if (node.type === NODE_TYPES.TASK) return `Task assigned to ${node.data.assignee || 'Unassigned'}: ${node.data.title}`;
  if (node.type === NODE_TYPES.APPROVAL) return `Approval requested from ${node.data.approverRole}: ${node.data.title}`;
  if (node.type === NODE_TYPES.AUTOMATED) return `Automation executed: ${node.data.actionId || 'No action selected'}`;
  return `Workflow completed: ${node.data.endMessage}`;
}

export async function simulateWorkflow(workflowJson) {
  await wait(500);

  const { nodes, edges } = workflowJson;
  const { outgoing } = buildAdjacency(nodes, edges);
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const startNode = nodes.find((node) => node.type === NODE_TYPES.START);

  if (!startNode) {
    return {
      runId: crypto.randomUUID(),
      status: 'failed',
      steps: [{ id: crypto.randomUUID(), status: 'error', message: 'No Start node found.' }],
    };
  }

  const queue = [startNode.id];
  const seen = new Set();
  const steps = [];

  while (queue.length) {
    const currentId = queue.shift();
    if (!currentId || seen.has(currentId)) continue;
    seen.add(currentId);

    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    steps.push({
      id: crypto.randomUUID(),
      nodeId: currentNode.id,
      nodeType: currentNode.type,
      status: currentNode.type === NODE_TYPES.APPROVAL ? 'waiting' : 'success',
      message: describeNode(currentNode),
    });

    for (const nextNodeId of outgoing.get(currentId) ?? []) queue.push(nextNodeId);
  }

  return { runId: crypto.randomUUID(), status: 'success', steps };
}
