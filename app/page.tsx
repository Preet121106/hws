'use client';

import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container flex items-center justify-between h-16 mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-900">
            Sentiment Analysis Chatbot
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4 mb-8">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Start a conversation to analyze sentiments!
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </div>
          <div className="sticky bottom-4 bg-white p-4 rounded-lg shadow-lg">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}