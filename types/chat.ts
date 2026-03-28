export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'text' | 'phone-capture-request' | 'quick-reply';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
  timestamp: Date;
}

export interface ChatContext {
  currentPage?: string;
  propertySlug?: string;
  propertyTitle?: string;
}
