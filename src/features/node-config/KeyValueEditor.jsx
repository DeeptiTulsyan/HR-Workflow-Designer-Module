import { Button, InputField, TextInput } from '../../shared/ui';

export function KeyValueEditor({ label, entries = [], onChange }) {
  const updateEntry = (entryId, field, value) => {
    onChange(entries.map((entry) => (entry.id === entryId ? { ...entry, [field]: value } : entry)));
  };

  const addEntry = () => {
    onChange([...entries, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const removeEntry = (entryId) => {
    onChange(entries.filter((entry) => entry.id !== entryId));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <Button type="button" variant="secondary" className="px-3 py-2 text-xs" onClick={addEntry}>
          Add field
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-400">
          No key-value pairs added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <InputField label="Key">
                <TextInput value={entry.key} onChange={(event) => updateEntry(entry.id, 'key', event.target.value)} placeholder="e.g. department" />
              </InputField>
              <InputField label="Value">
                <TextInput value={entry.value} onChange={(event) => updateEntry(entry.id, 'value', event.target.value)} placeholder="e.g. finance" />
              </InputField>
              <div className="flex items-end">
                <Button type="button" variant="danger" className="w-full px-3 py-3 text-xs" onClick={() => removeEntry(entry.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
