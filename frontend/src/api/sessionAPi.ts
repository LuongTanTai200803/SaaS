import ht from './axiosClient';

export type DraftStatus = 'DRAFT' | 'EDITING' | string;

export type CompleteSessionRequest = {
  sessionUuid: string;
  userText: string;
  model: string;
};

export type SaveDraftRequest = {
  sessionUuid: string;
  editorText: string | null;
  formData: Record<string, any>;
  fieldCode: string;
};

export type DraftStateDTO = {
  sessionUuid: string;
  userId: string;
  editorText: string | null;
  status: string;
  formData: Record<string, any> | null;
  updatedAt: string;
  fieldCode: string;
};

export const sessionApi = {
  createSession: (assistantId: string, sessionName: string) =>
    ht.post('/chat-sessions', { assistantId, sessionName }),

  getSessions: (assistantId: string) =>
    ht.get('/chat-sessions', { params: { assistantId } }),

  getSession: (sessionId: string) =>
    ht.get(`/chat-sessions/${sessionId}`),

  updateSessionName: (sessionUuid: string, sessionName: string) =>
    ht.put(`/chat-sessions/${sessionUuid}/name`, { sessionName }),

  deleteSession: (sessionId: string) =>
    ht.delete(`/chat-sessions/${sessionId}`),

  getSessionMessages: (sessionId: string) =>
    ht.get(`/chat-sessions/${sessionId}/messages`),

  createSessionMessages: (sessionId: string, content: string) =>
    ht.post(`/chat-sessions/${sessionId}/messages`, { content }),

  getDraft: (draftId: string) =>
    ht.get(`/drafts/${draftId}`),

  saveDraft: (data: SaveDraftRequest) =>
    ht.put<DraftStateDTO>('/drafts', data),

  completeSession: (data: CompleteSessionRequest) =>
    ht.post('/ai/completions', data),
  refineWorkspace: (data: CompleteSessionRequest) =>
    ht.post('/ai/workspace/refine', data)
};
