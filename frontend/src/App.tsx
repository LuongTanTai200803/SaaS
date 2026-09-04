import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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
        element={
          <AIWorkspace
            onBack={() => navigate('/')}
            onGenerated={(content, title, assistantId) =>
              navigate('/workspace', { state: { content, title, assistantId } })
            }
          />
        }
      />

      <Route
        path="/wizard/:assistantId/:sessionUuid?"
        element={
          <AIWorkspaceWrapper
            onBack={() => navigate('/')}
            onGenerated={(content, title, assistantId) =>
              navigate('/workspace', { state: { content, title, assistantId } })
            }
          />
        }
      />

      <Route
        path="/workspace"
        element={<DocumentWorkspaceWrapper onBack={() => navigate('/wizard')} />}
      />
      <Route
        path="/workspace/:sessionUuid"
        element={<DocumentWorkspaceWrapper onBack={() => navigate('/wizard')} />}
      />
    </Routes>
  );
}


function AIWorkspaceWrapper({
  onBack,
  onGenerated,
}: {
  onBack: () => void,
  onGenerated: (content: string | Record<string, any>, title: string, assistantId?: string) => void
}) {
  const { assistantId, sessionUuid } = useParams();
  return (
    <AIWorkspace
      key={`${assistantId ?? 'none'}-${sessionUuid ?? 'none'}`}
      onBack={onBack}
      initialAssistantId={assistantId}
      initialSessionUuid={sessionUuid}
      onGenerated={onGenerated}
    />
  );
}
function DocumentWorkspaceWrapper({ onBack }: { onBack: () => void }) {
  const location = useLocation();
  const params = useParams<{ sessionUuid?: string }>();
  const state = location.state as { content?: string | Record<string, any>; title?: string; assistantId?: string; formData?: any } | null;

  return (
  <DocumentWorkspace
  sessionUuid={params?.sessionUuid ?? undefined}
  initialContent={state?.content || ''}
  documentTitle={state?.title || ''}
  formData={state?.formData}
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