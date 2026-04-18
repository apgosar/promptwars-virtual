import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Stadium } from '../../types';
import { Bot, Send, User } from 'lucide-react';

interface AssistantProps {
  stadium: Stadium;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

/**
 * AI Assistant component providing venue-specific information using Gemini AI.
 * Enhanced with accessibility features and Markdown rendering.
 */
export const Assistant: React.FC<AssistantProps> = ({ stadium }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: `Welcome to **${stadium.name}**! How can I help you today?` }
  ]);
  const [loading, setLoading] = useState(false);

  /**
   * Sends user query to Gemini and handles the response.
   */
  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
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
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px', padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bot size={24} color="var(--accent-primary)" />
        AI Concierge
      </h3>
      
      <div 
        role="log"
        aria-live="polite"
        style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%'
          }}>
            {msg.role === 'assistant' && <div style={{ background: 'var(--glass-border)', padding: '0.5rem', borderRadius: '50%' }}><Bot size={16} /></div>}
            <div style={{
              background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              borderTopRightRadius: msg.role === 'user' ? 0 : '12px',
              borderTopLeftRadius: msg.role === 'assistant' ? 0 : '12px',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              lineHeight: '1.4'
            }}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
            {msg.role === 'user' && <div style={{ background: 'var(--glass-border)', padding: '0.5rem', borderRadius: '50%' }}><User size={16} /></div>}
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)' }}>Thinking...</div>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <label htmlFor="chat-input" className="sr-only">Ask a question to the AI concierge</label>
        <input
          id="chat-input"
          type="text"
          className="custom-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about gates, food..."
        />
        <button 
          className="btn-primary" 
          onClick={handleSend} 
          disabled={loading} 
          style={{ padding: '0.75rem' }}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
