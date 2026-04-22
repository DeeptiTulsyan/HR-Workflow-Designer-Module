# HR Workflow Designer

A React + Vite prototype for visually designing internal HR workflows such as onboarding, approvals, and automated follow-ups. The app uses React Flow for the canvas, modular node configuration forms for editing step details, and a local mock API layer for automation data and workflow simulation.

## What this prototype includes
- Drag-and-drop workflow canvas with custom nodes
- Start, Task, Approval, Automated Step, and End node types
- Editable node form panel for each node type
- Mock automation catalog and workflow simulation APIs
- Validation for missing structure, cycles, and required fields
- Sandbox panel with serialized workflow JSON and execution log

## Tech choices
- React + Vite for a fast prototype setup
- JavaScript to stay implementation-focused and approachable for this case study
- Tailwind CSS for rapid UI composition
- React Flow for graph editing and visualization

## Project structure
- `src/app`: app shell and global styles
- `src/features/workflow-canvas`: canvas, sidebar, and custom node components
- `src/features/node-config`: node editing forms and shared key-value editor
- `src/features/sandbox`: validation and simulation UI
- `src/entities/workflow`: node factories, graph helpers, serialization, validation
- `src/services/mock-api`: lightweight mock API layer
- `src/shared`: reusable UI primitives

## How to run
```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Design decisions
- Workflow state is kept in one top-level container so the canvas, form panel, and sandbox all operate on the same source of truth.
- Each node type has its own form component to keep the configuration layer modular and easy to extend.
- Mock APIs are separated from UI code so the frontend could later switch to real backend endpoints with minimal churn.
- Validation runs against the full graph and surfaces errors before simulation, which matches how a real workflow editor would protect users from invalid submissions.

## Assumptions
- This prototype is frontend-only and does not persist workflows.
- Simulation is a mock execution pass intended to demonstrate graph serialization and step-by-step feedback, not production workflow orchestration.
- The app focuses on the required case-study features first; bonus features like undo/redo and import/export are intentionally left out.

## What I completed
- Core workflow builder UI
- Required node types and configuration forms
- Local mock API integration for automation actions and simulation
- Validation, JSON serialization, and sandbox execution log
- README with architecture and tradeoff notes

## What I would add with more time
- Unit tests around validation and simulation helpers
- Import/export workflow JSON
- Visual inline validation indicators directly on nodes
- Undo/redo support
- Auto-layout for larger workflow graphs
