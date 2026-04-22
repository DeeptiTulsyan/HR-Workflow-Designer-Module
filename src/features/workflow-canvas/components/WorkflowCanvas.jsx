import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useReactFlow } from 'reactflow';
import { Panel } from '../../../shared/ui';
import { NODE_LIBRARY } from '../../../entities/workflow/constants';
import { ApprovalNode, AutomatedStepNode, EndNode, StartNode, TaskNode } from './nodeTypes';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedStepNode,
  end: EndNode,
};

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setEdges,
  addNode,
  selectedNodeId,
  setSelectedNodeId,
}) {
  const wrapperRef = useRef(null);
  const reactFlow = useReactFlow();

  const handleSelectionChange = useCallback(
    (selection) => {
      const nextSelectedId = selection?.nodes?.[0]?.id ?? null;
      setSelectedNodeId(nextSelectedId);
    },
    [setSelectedNodeId],
  );

  const handleNodeClick = useCallback(
    (_event, node) => {
      setSelectedNodeId(node?.id ?? null);
    },
    [setSelectedNodeId],
  );

  const flowNodes = useMemo(
    () => nodes.map((node) => ({ ...node, selected: node.id === selectedNodeId })),
    [nodes, selectedNodeId],
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((currentEdges) => addEdge({ ...connection, animated: true }, currentEdges));
    },
    [setEdges],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type =
        event.dataTransfer.getData('application/reactflow') ||
        event.dataTransfer.getData('text/plain');
      const isKnownType = NODE_LIBRARY.some((node) => node.type === type);
      if (!type || !isKnownType) return;

      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlow.screenToFlowPosition
        ? reactFlow.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          })
        : reactFlow.project({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          });

      addNode(type, position);
    },
    [addNode, reactFlow],
  );

  return (
    <Panel className="relative min-h-[700px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Canvas
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Workflow Builder</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
          Drag nodes in, connect them, then edit details from the right panel
        </div>
      </div>

      <div ref={wrapperRef} className="h-[700px] pt-[76px]">
        <ReactFlow
          nodes={flowNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={handleSelectionChange}
          onNodeClick={handleNodeClick}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
          selectionOnDrag
        >
          <Background color="#1e293b" gap={20} />
          <MiniMap
            pannable
            zoomable
            style={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Controls />
        </ReactFlow>
      </div>
    </Panel>
  );
}
