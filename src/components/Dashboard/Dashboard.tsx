import React, { useState } from 'react';
import type { Stadium } from '../../types';
import { Ticket, MapPin, Navigation } from 'lucide-react';

interface DashboardProps {
  stadium: Stadium;
  onSectionSelect: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stadium, onSectionSelect }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [scannedSection, setScannedSection] = useState<string | null>(null);

  const bestGate = React.useMemo(() => {
    if (!scannedSection) return null;
    return stadium.gates.find(g => g.closestSections.includes(scannedSection));
  }, [scannedSection, stadium]);

  const handleScan = () => {
    // Mock simulation: the user enters a section like "A1" or "VIP"
    if (ticketInput.trim()) {
      setScannedSection(ticketInput.trim().toUpperCase());
      onSectionSelect(ticketInput.trim().toUpperCase());
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-glow)', padding: '0.75rem', borderRadius: '12px' }}>
          <Ticket size={32} color="var(--accent-secondary)" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Digital Ticket</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Enter your section for personalized routing</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <label htmlFor="ticket-input" className="sr-only">Enter your section (e.g. VIP, A1)</label>
        <input 
          id="ticket-input"
          type="text" 
          className="custom-input" 
          placeholder="e.g. VIP, A1, C3" 
          value={ticketInput}
          onChange={e => setTicketInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleScan()}
        />
        <button className="btn-primary" onClick={handleScan}>Scan</button>
      </div>

      {scannedSection && bestGate && (
        <div style={{ 
          marginTop: '1rem', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid var(--success)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Navigation size={20} />
            Route Optimized
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your Section</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{scannedSection}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fastest Gate</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} />
                {bestGate.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {scannedSection && !bestGate && (
        <div style={{ 
          marginTop: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid var(--danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ color: 'var(--danger)', margin: 0 }}>Section not found in this stadium layout.</p>
        </div>
      )}
    </div>
  );
};
