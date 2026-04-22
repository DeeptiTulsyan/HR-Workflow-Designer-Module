import { useEffect, useMemo, useState } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';
import { createInitialWorkflowNodes, createNodeFromType } from '../entities/workflow/factories';
import { serializeWorkflow } from '../entities/workflow/serialization';
import { validateWorkflow } from '../entities/workflow/validation';
import { CanvasSidebar } from '../features/workflow-canvas/components/CanvasSidebar';
import { WorkflowCanvas } from '../features/workflow-canvas/components/WorkflowCanvas';
import { NodeConfigPanel } from '../features/node-config/NodeConfigPanel';
import { SandboxPanel } from '../features/sandbox/SandboxPanel';
import { getAutomations } from '../services/mock-api/workflowApi';

export function AppShell() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialWorkflowNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [automationOptions, setAutomationOptions] = useState([]);
  const [automationLoading, setAutomationLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    getAutomations()
      .then((response) => {
        if (alive) setAutomationOptions(response);
      })
      .finally(() => {
        if (alive) setAutomationLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
  const workflowJson = useMemo(() => serializeWorkflow(nodes, edges), [nodes, edges]);
  const validation = useMemo(() => validateWorkflow(nodes, edges, automationOptions), [nodes, edges, automationOptions]);

  const addNode = (type, position) => {
    const newNode = createNodeFromType(type, position);
    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const updateSelectedNodeData = (nextData) => {
    if (!selectedNodeId) return;

    setNodes((currentNodes) =>
      currentNodes.map((node) => (node.id === selectedNodeId ? { ...node, data: nextData } : node)),
    );
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#0f172a_40%,_#020617)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col gap-4 p-4 lg:p-6">
        <header className="rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
                Tredence Case Study Prototype
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white">HR Workflow Designer</h1>
              <p className="max-w-3xl text-sm text-slate-300">
                Design onboarding, leave approval, and document verification flows with reusable
                nodes, live validation, and a lightweight execution sandbox.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 sm:grid-cols-4">
              <MetricCard label="Node Types" value="5" />
              <MetricCard label="Mock APIs" value="2" />
              <MetricCard label="Validation" value={`${validation.errors.length} issues`} />
              <MetricCard label="Automation Catalog" value={automationLoading ? 'Loading' : `${automationOptions.length} actions`} />
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <CanvasSidebar />
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setEdges={setEdges}
            addNode={addNode}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
          />
          <NodeConfigPanel
            node={selectedNode}
            onUpdateNodeData={updateSelectedNodeData}
            onDeleteNode={deleteSelectedNode}
            automationOptions={automationOptions}
            automationLoading={automationLoading}
          />
        </div>

        <SandboxPanel validation={validation} workflowJson={workflowJson} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
