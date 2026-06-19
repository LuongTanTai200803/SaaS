// src/api/chatApi.ts
import ht from './axiosClient';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  createdAt?: string; // For existing messages from API
};

export type ChatSession = {
  sessionId: number;
  tagId: string;
  sessionName: string;
  currentEditorContent: string;
  createdAt: string;
};

export type CompletionRequest = {
  sessionId: number;
  wizardStateJson: string;
  promptCommand: string;
  pinEditorContext: boolean;
  model: string;
};

export const chatApi = {
  generateCompletion: (payload: CompletionRequest) => {
    return ht.post('/ai/completions', payload, {
      headers: { Accept: 'text/event-stream' },
      responseType: 'stream', // This might need special handling for SSE
    });
  },
  getChatHistory: (sessionId: number) => {
    const url = `/ai/chat-history/${sessionId}`;
    return ht.get<{ messages: ChatMessage[] }>(url);
  },
  pinContext: (sessionId: number, payload: { htmlContent: string }) => {
    const url = `/ai/chat-history/${sessionId}/pin`;
    return ht.post(url, payload);
  },
};