import { NODE_LIBRARY } from '../../../entities/workflow/constants';
import { Panel, SectionTitle } from '../../../shared/ui';

export function CanvasSidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Panel className="flex h-full flex-col gap-5 p-5">
      <SectionTitle
        eyebrow="Palette"
        title="Workflow Nodes"
        description="Drag these building blocks into the canvas and wire them together."
      />

      <div className="space-y-3">
        {NODE_LIBRARY.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
            className="w-full cursor-grab rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:border-cyan-300/50 hover:bg-white/[0.08] active:cursor-grabbing"
          >
            <div className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${node.accent}`} />
            <div className="text-sm font-semibold text-white">{node.label}</div>
            <div className="mt-1 text-sm leading-6 text-slate-300">{node.description}</div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50">
        Tip: drop a <strong>Task</strong> or <strong>Approval</strong> node beside the Start node,
        connect the flow, and then configure details on the right.
      </div>
    </Panel>
  );
}
