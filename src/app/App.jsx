import { ReactFlowProvider } from 'reactflow';
import { AppShell } from './AppShell';

export default function App() {
  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  );
}
