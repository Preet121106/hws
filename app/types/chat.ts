export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  sentiment?: 'positive' | 'neutral' | 'negative';
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}