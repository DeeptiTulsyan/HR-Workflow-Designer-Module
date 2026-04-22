import { NODE_TYPES } from './constants';
import { buildAdjacency, detectCycle, getReachableNodeIds } from './graph';

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function validateKeyValuePairs(entries, label, errors, nodeLabel) {
  entries.forEach((entry, index) => {
    const keyFilled = hasValue(entry.key);
    const valueFilled = hasValue(entry.value);
    if (keyFilled !== valueFilled) {
      errors.push(`${nodeLabel}: ${label} row ${index + 1} must include both key and value.`);
    }
  });
}

function validateRequiredNodeFields(node, errors, automationOptions) {
  const nodeLabel = node.data.title || node.data.label || node.id;

  if (node.type === NODE_TYPES.START) {
    if (!hasValue(node.data.title)) errors.push('Start node must have a title.');
    validateKeyValuePairs(node.data.metadata ?? [], 'metadata', errors, nodeLabel);
  }

  if (node.type === NODE_TYPES.TASK) {
    if (!hasValue(node.data.title)) errors.push(`${nodeLabel}: task title is required.`);
    validateKeyValuePairs(node.data.customFields ?? [], 'custom field', errors, nodeLabel);
  }

  if (node.type === NODE_TYPES.APPROVAL) {
    if (!hasValue(node.data.title)) errors.push(`${nodeLabel}: approval title is required.`);
    if (!hasValue(node.data.approverRole)) errors.push(`${nodeLabel}: approver role is required.`);
  }

  if (node.type === NODE_TYPES.AUTOMATED) {
    if (!hasValue(node.data.title)) errors.push(`${nodeLabel}: automated step title is required.`);
    if (!hasValue(node.data.actionId)) {
      errors.push(`${nodeLabel}: choose an automation action.`);
    } else {
      const action = automationOptions.find((option) => option.id === node.data.actionId);
      if (!action) {
        errors.push(`${nodeLabel}: selected automation action is invalid.`);
      } else {
        action.params.forEach((param) => {
          if (!hasValue(node.data.actionParams?.[param])) {
            errors.push(`${nodeLabel}: parameter "${param}" is required.`);
          }
        });
      }
    }
  }

  if (node.type === NODE_TYPES.END && !hasValue(node.data.endMessage)) {
    errors.push('End node must include a completion message.');
  }
}

export function validateWorkflow(nodes, edges, automationOptions = []) {
  const errors = [];
  const warnings = [];
  const startNodes = nodes.filter((node) => node.type === NODE_TYPES.START);
  const endNodes = nodes.filter((node) => node.type === NODE_TYPES.END);
  const { outgoing, incoming } = buildAdjacency(nodes, edges);

  if (startNodes.length !== 1) errors.push('Exactly one Start node is required.');
  if (endNodes.length < 1) errors.push('At least one End node is required.');
  if (detectCycle(nodes, edges)) errors.push('Cycles detected. The workflow sandbox expects an acyclic graph.');

  nodes.forEach((node) => {
    validateRequiredNodeFields(node, errors, automationOptions);
    const incomingCount = incoming.get(node.id)?.length ?? 0;
    const outgoingCount = outgoing.get(node.id)?.length ?? 0;

    if (node.type === NODE_TYPES.START && incomingCount > 0) {
      errors.push('Start node cannot have incoming connections.');
    }
    if (node.type !== NODE_TYPES.START && incomingCount === 0) {
      warnings.push(`${node.data.label} is not connected from a previous step.`);
    }
    if (node.type === NODE_TYPES.END && outgoingCount > 0) {
      errors.push('End node cannot have outgoing connections.');
    }
    if (node.type !== NODE_TYPES.END && outgoingCount === 0) {
      warnings.push(`${node.data.label} does not lead to a next step.`);
    }
  });

  const startNode = startNodes[0];
  if (startNode) {
    const reachableIds = getReachableNodeIds(startNode.id, outgoing);
    nodes
      .filter((node) => node.id !== startNode.id && !reachableIds.has(node.id))
      .forEach((node) => errors.push(`${node.data.label} is not reachable from the Start node.`));
  }

  return { isValid: errors.length === 0, errors, warnings };
}
