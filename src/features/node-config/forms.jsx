import { KeyValueEditor } from './KeyValueEditor';
import { InputField, Select, TextArea, TextInput } from '../../shared/ui';

export function StartNodeForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <InputField label="Start title">
        <TextInput value={data.title} onChange={(event) => onChange({ ...data, title: event.target.value })} placeholder="Employee onboarding" />
      </InputField>
      <KeyValueEditor label="Metadata" entries={data.metadata} onChange={(metadata) => onChange({ ...data, metadata })} />
    </div>
  );
}

export function TaskNodeForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <InputField label="Title" hint="Required">
        <TextInput value={data.title} onChange={(event) => onChange({ ...data, title: event.target.value })} placeholder="Collect documents" />
      </InputField>
      <InputField label="Description">
        <TextArea value={data.description} onChange={(event) => onChange({ ...data, description: event.target.value })} placeholder="Describe what the assignee needs to complete" />
      </InputField>
      <InputField label="Assignee">
        <TextInput value={data.assignee} onChange={(event) => onChange({ ...data, assignee: event.target.value })} placeholder="HR executive" />
      </InputField>
      <InputField label="Due date">
        <TextInput type="date" value={data.dueDate} onChange={(event) => onChange({ ...data, dueDate: event.target.value })} />
      </InputField>
      <KeyValueEditor label="Custom fields" entries={data.customFields} onChange={(customFields) => onChange({ ...data, customFields })} />
    </div>
  );
}

export function ApprovalNodeForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <InputField label="Title">
        <TextInput value={data.title} onChange={(event) => onChange({ ...data, title: event.target.value })} placeholder="Manager approval" />
      </InputField>
      <InputField label="Approver role">
        <TextInput value={data.approverRole} onChange={(event) => onChange({ ...data, approverRole: event.target.value })} placeholder="Manager" />
      </InputField>
      <InputField label="Auto-approve threshold">
        <TextInput type="number" min="0" value={data.autoApproveThreshold} onChange={(event) => onChange({ ...data, autoApproveThreshold: Number(event.target.value) || 0 })} placeholder="0" />
      </InputField>
    </div>
  );
}

export function AutomatedNodeForm({ data, onChange, automationOptions, automationLoading }) {
  const selectedAction = automationOptions.find((option) => option.id === data.actionId);

  const updateParam = (param, value) => {
    onChange({
      ...data,
      actionParams: {
        ...data.actionParams,
        [param]: value,
      },
    });
  };

  const onActionChange = (event) => {
    const nextActionId = event.target.value;
    const action = automationOptions.find((option) => option.id === nextActionId);
    const nextParams = {};
    (action?.params ?? []).forEach((param) => {
      nextParams[param] = '';
    });

    onChange({
      ...data,
      actionId: nextActionId,
      actionParams: nextParams,
    });
  };

  return (
    <div className="space-y-4">
      <InputField label="Title">
        <TextInput value={data.title} onChange={(event) => onChange({ ...data, title: event.target.value })} placeholder="Send welcome email" />
      </InputField>
      <InputField label="Automation action" hint={automationLoading ? 'Loading actions' : undefined}>
        <Select value={data.actionId} onChange={onActionChange} disabled={automationLoading}>
          <option value="">Select action</option>
          {automationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
      </InputField>

      {selectedAction ? (
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <div className="text-sm font-medium text-white">Action parameters</div>
          {selectedAction.params.map((param) => (
            <InputField key={param} label={param}>
              <TextInput value={data.actionParams?.[param] ?? ''} onChange={(event) => updateParam(param, event.target.value)} placeholder={`Enter ${param}`} />
            </InputField>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function EndNodeForm({ data, onChange }) {
  return (
    <div className="space-y-4">
      <InputField label="End message">
        <TextArea value={data.endMessage} onChange={(event) => onChange({ ...data, endMessage: event.target.value })} placeholder="Workflow complete" />
      </InputField>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <input type="checkbox" checked={data.includeSummary} onChange={(event) => onChange({ ...data, includeSummary: event.target.checked })} className="h-4 w-4 rounded border-white/10 bg-slate-900" />
        <div>
          <div className="text-sm font-medium text-white">Summary flag</div>
          <div className="text-xs text-slate-400">Include a summary in the completion state</div>
        </div>
      </label>
    </div>
  );
}
