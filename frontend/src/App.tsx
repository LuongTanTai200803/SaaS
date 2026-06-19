import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AIWorkspace } from './components/AIWorkspace';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Dashboard } from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: 'home' | 'wizard', assistantId?: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'wizard') {
      if (assistantId) {
        navigate(`/wizard/${assistantId}`);
      } else {
        navigate('/wizard');
      }
    }
  };

  const handleNavigateToWorkspace = (content: string | Record<string, any>, title: string, assistantId?: string) => {
    navigate('/workspace', { state: { content, title, assistantId } });
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
      <Route path="/dashboard" element={<HomePage onNavigate={handleNavigate} initialShowDashboard={true} />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route 
        path="/wizard" 
        element={<AIWorkspace onBack={() => navigate('/')} onGenerated={handleNavigateToWorkspace} />} 
      />
      <Route 
        path="/wizard/:assistantId" 
        element={<AIWorkspaceWrapper onBack={() => navigate('/')} onGenerated={handleNavigateToWorkspace} />} 
      />
      <Route 
        path="/workspace" 
        element={<DocumentWorkspaceWrapper onBack={() => navigate('/wizard')} />} 
      />
    </Routes>
  );
}

function AIWorkspaceWrapper({ onBack, onGenerated }: { onBack: () => void, onGenerated: (content: string | Record<string, any>, title: string, assistantId?: string) => void }) {
  const { pathname } = useLocation();
  const assistantId = pathname.split('/').pop();
  return <AIWorkspace key={assistantId} onBack={onBack} initialAssistantId={assistantId} onGenerated={onGenerated} />;
}

function DocumentWorkspaceWrapper({ onBack }: { onBack: () => void }) {
  const location = useLocation();
  const state = location.state as { content?: string | Record<string, any>; title?: string; assistantId?: string } | null;
  return (
    <DocumentWorkspace 
      initialContent={state?.content || ''}
      documentTitle={state?.title || ''}
      assistantId={state?.assistantId}
      onBack={onBack}
    />
  );
}

export default function App() {
  return (
    
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    
  );
}