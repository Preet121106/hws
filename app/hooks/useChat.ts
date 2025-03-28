'use client';

import { useState, useCallback, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, ChatState } from '../types/chat';

const GEMINI_API_KEY = 'AIzaSyDDxSLJA6-SGSanq9etqd32B4nxMO-htHA';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setState(prev => ({
        ...prev,
        messages: JSON.parse(savedMessages),
      }));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(state.messages));
  }, [state.messages]);

  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = /\b(good|great|excellent|amazing|happy|love|wonderful|fantastic|awesome|positive)\b/i;
    const negativeWords = /\b(bad|terrible|awful|horrible|sad|hate|negative|poor|unfortunate|wrong)\b/i;
    
    if (positiveWords.test(text)) return 'positive';
    if (negativeWords.test(text)) return 'negative';
    return 'neutral';
  };

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      sentiment: analyzeSentiment(content),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat();
      const result = await chat.sendMessageStream(content);

      const botMessageId = (Date.now() + 1).toString();
      let fullResponse = '';

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          id: botMessageId,
          content: '',
          role: 'assistant',
          isStreaming: true,
        }],
      }));

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === botMessageId
              ? { ...msg, content: fullResponse }
              : msg
          ),
        }));
      }

      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: fullResponse,
                sentiment: analyzeSentiment(fullResponse),
                isStreaming: false,
              }
            : msg
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearChat = useCallback(() => {
    setState({ messages: [], isLoading: false });
    localStorage.removeItem('chatHistory');
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    sendMessage,
    clearChat,
  };
}