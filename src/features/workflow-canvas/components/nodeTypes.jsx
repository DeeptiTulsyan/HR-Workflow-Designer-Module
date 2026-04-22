import { BaseWorkflowNode } from './BaseWorkflowNode';

export function StartNode(props) {
  return (
    <BaseWorkflowNode {...props}>
      <div>Metadata entries: {props.data.metadata?.length ?? 0}</div>
    </BaseWorkflowNode>
  );
}

export function TaskNode(props) {
  return (
    <BaseWorkflowNode {...props}>
      <div>Assignee: {props.data.assignee || 'Not assigned'}</div>
      <div>Due date: {props.data.dueDate || 'No due date'}</div>
    </BaseWorkflowNode>
  );
}

export function ApprovalNode(props) {
  return (
    <BaseWorkflowNode {...props}>
      <div>Approver role: {props.data.approverRole || 'Not set'}</div>
      <div>Auto-approve threshold: {props.data.autoApproveThreshold || 0}</div>
    </BaseWorkflowNode>
  );
}

export function AutomatedStepNode(props) {
  return (
    <BaseWorkflowNode {...props}>
      <div>Action: {props.data.actionId || 'Choose from panel'}</div>
      <div>Parameters: {Object.keys(props.data.actionParams ?? {}).length}</div>
    </BaseWorkflowNode>
  );
}

export function EndNode(props) {
  return (
    <BaseWorkflowNode {...props}>
      <div>Summary included: {props.data.includeSummary ? 'Yes' : 'No'}</div>
    </BaseWorkflowNode>
  );
}
