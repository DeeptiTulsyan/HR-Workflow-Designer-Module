import { NODE_TYPES } from '../../entities/workflow/constants';
import { Button, Panel, SectionTitle } from '../../shared/ui';
import { ApprovalNodeForm, AutomatedNodeForm, EndNodeForm, StartNodeForm, TaskNodeForm } from './forms';

function EmptyState() {
  return (
    <div className="flex h-full min-h-[480px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 text-center text-sm leading-6 text-slate-400">
      Select a node on the canvas to edit its configuration. Each node type has its own controlled
      form so the workflow state stays explicit and easy to extend.
    </div>
  );
}

export function NodeConfigPanel({ node, onUpdateNodeData, onDeleteNode, automationOptions, automationLoading }) {
  const renderForm = () => {
    if (!node) return <EmptyState />;

    const formProps = {
      data: node.data,
      onChange: onUpdateNodeData,
    };

    if (node.type === NODE_TYPES.START) return <StartNodeForm {...formProps} />;
    if (node.type === NODE_TYPES.TASK) return <TaskNodeForm {...formProps} />;
    if (node.type === NODE_TYPES.APPROVAL) return <ApprovalNodeForm {...formProps} />;
    if (node.type === NODE_TYPES.AUTOMATED) {
      return <AutomatedNodeForm {...formProps} automationOptions={automationOptions} automationLoading={automationLoading} />;
    }
    if (node.type === NODE_TYPES.END) return <EndNodeForm {...formProps} />;
    return null;
  };

  return (
    <Panel className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-4">
        <SectionTitle
          eyebrow="Configuration"
          title={node ? `Edit ${node.data.label}` : 'Node Details'}
          description={
            node
              ? 'Update the selected step using controlled inputs. Changes are reflected directly in the workflow graph.'
              : 'Choose a node from the canvas to configure titles, assignments, approval logic, and automation parameters.'
          }
        />

        {node ? (
          <Button type="button" variant="danger" className="shrink-0" onClick={onDeleteNode}>
            Delete node
          </Button>
        ) : null}
      </div>

      <div className="mt-6 flex-1">{renderForm()}</div>
    </Panel>
  );
}
