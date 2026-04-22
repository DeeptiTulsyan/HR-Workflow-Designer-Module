import { Handle, Position } from 'reactflow';
import { clsx } from 'clsx';

export function BaseWorkflowNode({ data, selected, children }) {
  return (
    <div
      className={clsx(
        'relative min-w-[220px] rounded-[24px] border border-white/15 bg-slate-950/85 p-4 shadow-[0_24px_60px_-24px_rgba(8,47,73,0.7)] backdrop-blur transition',
        selected && 'ring-2 ring-cyan-400/80',
      )}
    >
      <div className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${data.accent}`} />
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          {data.label}
        </p>
        <h3 className="text-sm font-semibold text-white">
          {data.title || data.endMessage || 'Untitled node'}
        </h3>
      </div>

      <div className="mt-3 text-xs leading-5 text-slate-300">{children}</div>

      {data.type !== 'start' ? <Handle type="target" position={Position.Left} /> : null}
      {data.type !== 'end' ? <Handle type="source" position={Position.Right} /> : null}
    </div>
  );
}
