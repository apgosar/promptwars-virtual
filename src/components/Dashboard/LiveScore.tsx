import React, { useState, useEffect } from 'react';
import { Trophy, Circle } from 'lucide-react';

interface LiveScoreProps {
  homeTeam?: string;
  awayTeam?: string;
  initialHomeScore?: number;
  initialAwayScore?: number;
}

/**
 * A sleek, real-time widget displaying the current match score.
 * Designed to enhance the "enjoyable experience" aspect of the event.
 */
export const LiveScore: React.FC<LiveScoreProps> = ({ 
  homeTeam = 'IND', 
  awayTeam = 'AUS',
  initialHomeScore = 214,
  initialAwayScore = 186
}) => {
  const [pulse, setPulse] = useState(false);

  // Simulate live updates blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="glass-card" 
      style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%)',
        borderLeft: '4px solid var(--accent-primary)'
      }}
      aria-label="Live Match Score"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Trophy size={28} color="var(--accent-primary)" aria-hidden="true" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Circle 
              size={10} 
              fill={pulse ? 'var(--danger)' : 'transparent'} 
              color="var(--danger)"
              style={{ transition: 'all 0.3s ease' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', letterSpacing: '1px', textTransform: 'uppercase' }}>Live</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Championship Final</h3>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{homeTeam}</p>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{initialHomeScore}</p>
        </div>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 300 }}>-</div>
        
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{awayTeam}</p>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{initialAwayScore}</p>
        </div>
      </div>
    </div>
  );
};
