import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  duration?: number;
}

/**
 * A global notification toast system for simulating real-time coordination.
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({ message, duration = 8000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Simulate an incoming push notification after a delay
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    if (visible) {
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
    return () => clearTimeout(hideTimer);
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        maxWidth: '400px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      <div style={{ color: 'var(--accent-primary)', marginTop: '0.1rem' }}>
        <AlertTriangle size={20} aria-hidden="true" />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 600 }}>CROWD FLOW ALERT</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{message}</p>
      </div>
      <button 
        onClick={() => setVisible(false)}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '0.25rem'
        }}
      >
        <X size={16} aria-hidden="true" />
      </button>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
