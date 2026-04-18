import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Stadium } from '../../types';
import { Bot, Send, User } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';

interface AssistantProps {
  stadium: Stadium;
}

/**
 * AI Assistant component providing venue-specific information using Gemini AI.
 * Enhanced with accessibility features and Markdown rendering.
 */
export const Assistant: React.FC<AssistantProps> = ({ stadium }) => {
  const [query, setQuery] = useState('');
  const { messages, loading, sendMessage } = useGemini(`Welcome to **${stadium.name}**! How can I help you today?`);

  /**
   * Handles passing the input to the Gemini hook.
   */
  const handleSend = async () => {
    if (!query.trim()) return;
    const currentQuery = query;
    setQuery(''); // Clear early for better UX
    await sendMessage(currentQuery, stadium);
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
