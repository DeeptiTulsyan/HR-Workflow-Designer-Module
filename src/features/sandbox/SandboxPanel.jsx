import { useState } from 'react';
import { simulateWorkflow } from '../../services/mock-api/workflowApi';
import { Button, Panel, SectionTitle } from '../../shared/ui';

function ValidationList({ title, items, tone }) {
  if (!items.length) return null;

  const styles = {
    error: 'border-rose-400/25 bg-rose-400/10 text-rose-100',
    warning: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
  };

  return (
    <div className={`rounded-3xl border p-4 ${styles[tone]}`}>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export function SandboxPanel({ validation, workflowJson }) {
  const [simulationResult, setSimulationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);
    try {
      const result = await simulateWorkflow(workflowJson);
      setSimulationResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Panel className="grid gap-4 p-5 xl:grid-cols-[1.2fr_0.8fr_1fr]">
      <div className="space-y-4">
        <SectionTitle
          eyebrow="Sandbox"
          title="Validate and simulate"
          description="Serialize the current graph, run a mock simulation, and inspect the execution log before handing the workflow to backend services."
        />

        <div className="flex items-center gap-3">
          <Button type="button" onClick={runSimulation} disabled={!validation.isValid || isRunning}>
            {isRunning ? 'Running simulation...' : 'Run simulation'}
          </Button>
          <div className="text-sm text-slate-400">
            {validation.isValid
              ? 'The graph passed validation and is ready for a sandbox run.'
              : 'Resolve validation errors before running the sandbox.'}
          </div>
        </div>

        <ValidationList title="Validation Errors" items={validation.errors} tone="error" />
        <ValidationList title="Warnings" items={validation.warnings} tone="warning" />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Workflow JSON</h3>
        <pre className="max-h-[360px] overflow-auto rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-300">
          {JSON.stringify(workflowJson, null, 2)}
        </pre>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Execution Log</h3>
        {!simulationResult ? (
          <div className="rounded-3xl border border-dashed border-white/10 px-4 py-5 text-sm leading-6 text-slate-400">
            No simulation has been run yet. Once the workflow validates, start the sandbox to see a
            step-by-step execution log here.
          </div>
        ) : (
          <div className="space-y-3">
            {simulationResult.steps.map((step, index) => (
              <div key={step.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-white">Step {index + 1}</div>
                  <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    {step.status}
                  </div>
                </div>
                <div className="mt-2 leading-6 text-slate-300">{step.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
