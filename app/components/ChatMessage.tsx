'use client';

import { Message } from '../types/chat';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';
  
  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg transition-colors',
        message.sentiment === 'positive' && 'bg-green-50',
        message.sentiment === 'negative' && 'bg-red-50',
        message.sentiment === 'neutral' && 'bg-gray-50',
        message.isStreaming && 'animate-pulse'
      )}
    >
      <div className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full',
        isBot ? 'bg-blue-100' : 'bg-gray-100'
      )}>
        {isBot ? <Bot className="w-5 h-5 text-blue-600" /> : <User className="w-5 h-5 text-gray-600" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium">
          {isBot ? 'AI Assistant' : 'You'}
        </div>
        <div className="text-gray-700 whitespace-pre-wrap">
          {message.content || (message.isStreaming ? '...' : '')}
        </div>
      </div>
    </div>
  );
}