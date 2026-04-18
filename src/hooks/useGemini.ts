import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Stadium } from '../types';

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface UseGeminiReturn {
  messages: Message[];
  loading: boolean;
  sendMessage: (query: string, stadium: Stadium) => Promise<void>;
}

/**
 * Custom hook to manage interactions with the Google Gemini API.
 */
export const useGemini = (initialWelcomeMessage: string): UseGeminiReturn => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: initialWelcomeMessage }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (query: string, stadium: Stadium) => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const context = `You are an intelligent venue assistant for ${stadium.name}.
      The stadium has the following amenities: ${stadium.amenities.map(a => `${a.name} (wait time: ${a.wait_time_mins} mins)`).join(', ')}.
      The stadium has the following gates: ${stadium.gates.map(g => `${g.name} serving sections ${g.closestSections.join(', ')}`).join(', ')}.
      Keep your responses concise, helpful, and tailored to the venue context. Use markdown for lists and bold text.`;

      const result = await model.generateContent(`${context}\n\nUser: ${userMessage}`);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessages(prev => [...prev, { role: 'assistant', text: `Sorry, I encountered an error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { messages, loading, sendMessage };
};
