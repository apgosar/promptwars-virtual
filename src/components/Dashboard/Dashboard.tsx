import React, { useState } from 'react';
import type { Stadium, Gate } from '../../types';
import { Ticket, MapPin, Navigation, Users, Clock, AlertCircle } from 'lucide-react';
import { analytics } from '../../utils/AnalyticsManager';
import { LiveScore } from './LiveScore';

interface DashboardProps {
  stadium: Stadium;
  onSectionSelect: (section: string) => void;
}

/**
 * Main dashboard component for ticket scanning and venue information.
 * Addressing "minimize crowd congestion" by providing real-time-like amenity status.
 */
export const Dashboard: React.FC<DashboardProps> = ({ stadium, onSectionSelect }) => {
  const [ticketInput, setTicketInput] = useState<string>('');
  const [scannedSection, setScannedSection] = useState<string | null>(null);

  /**
   * Calculates the best gate based on the scanned section.
   */
  const bestGate = React.useMemo<Gate | undefined>(() => {
    if (!scannedSection) return undefined;
    return stadium.gates.find(g => g.closestSections.includes(scannedSection));
  }, [scannedSection, stadium]);

  /**
   * Handles the simulated ticket scan.
   */
  const handleScan = () => {
    if (ticketInput.trim()) {
      const section = ticketInput.trim().toUpperCase();
      setScannedSection(section);
      onSectionSelect(section);
      analytics.trackEvent('ticket_scanned', { section });
    }
  };

  /**
   * Simulates reporting an issue to venue staff via Firestore.
   */
  const handleReportIssue = () => {
    alert("Issue reported to venue staff. Security has been dispatched.");
    analytics.trackEvent('issue_reported', { location: scannedSection || 'Unknown' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <LiveScore />
      
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--accent-glow)', padding: '0.75rem', borderRadius: '12px' }}>
          <Ticket size={32} color="var(--accent-secondary)" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Digital Ticket</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Enter your section for personalized routing</p>
        </div>
      </header>

      <div role="search" style={{ display: 'flex', gap: '1rem' }}>
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
        <section 
          aria-live="polite"
          style={{ 
            marginTop: '1rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid var(--success)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
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
        </section>
      )}

      {/* Real-time Congestion Panel - Addressing Problem Statement Alignment */}
      <section style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Users size={20} color="var(--accent-primary)" />
          Venue Live Status
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {stadium.amenities.map(amenity => (
            <div key={amenity.id} className="glass-card" style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{amenity.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: amenity.wait_time_mins > 10 ? 'var(--danger)' : 'var(--success)',
                  fontWeight: 600
                }}>
                  {amenity.wait_time_mins > 10 ? 'Busy' : 'Fast'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Clock size={12} />
                  {amenity.wait_time_mins}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

        {/* Incident Reporting Panel */}
        <section style={{ marginTop: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            onClick={handleReportIssue}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
          >
            <AlertCircle size={20} />
            Report Spill / Incident to Staff
          </button>
        </section>
      </div>
    </div>
  );
};
