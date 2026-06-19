import { AIWorkspace } from './AIWorkspace';

interface WorkspacePageProps {
  onNavigate: (page: 'dashboard' | 'workspace' | 'wizard' | 'billing') => void;
}

export function WorkspacePage({ onNavigate }: WorkspacePageProps) {
  return <AIWorkspace onNavigate={onNavigate} />;
}
