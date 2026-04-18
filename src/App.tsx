import React, { useState, useEffect, lazy, Suspense } from 'react';
// Lazy load heavy components
const VenueMap = lazy(() => import('./components/Map/VenueMap').then(module => ({ default: module.VenueMap })));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const Assistant = lazy(() => import('./components/Assistant/Assistant').then(module => ({ default: module.Assistant })));
import { AccessibilityManager } from './utils/AccessibilityManager';
import stadiumData from './data/stadiums.json';
import type { Stadium } from './types';
import { Map, Settings, Eye } from 'lucide-react';

function App() {
  const [stadiums] = useState<Stadium[]>(stadiumData.stadiums as Stadium[]);
  const [selectedStadium, setSelectedStadium] = useState<Stadium>(stadiums[0]);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | undefined>();
  const [accessibilityManager] = useState(() => AccessibilityManager.getInstance());

  useEffect(() => {
    const unsub = accessibilityManager.subscribe(enabled => {
      setHighContrast(enabled);
    });
    return unsub;
  }, [accessibilityManager]);

  const toggleHighContrast = () => {
    accessibilityManager.toggleHighContrast();
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Map size={36} color="var(--accent-primary)" />
          <div>
            <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EventXP
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Premium Venue Portal</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="custom-input" 
            aria-label="Select stadium venue"            style={{ width: 'auto', background: 'var(--glass-bg)' }}
            value={selectedStadium.id}
            onChange={(e) => {
              const stadium = stadiums.find(s => s.id === e.target.value);
              if (stadium) {
                setSelectedStadium(stadium);
                setHighlightedSection(undefined);
              }
            }}
          >
            {stadiums.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          
          <button 
            className="btn-secondary" 
            onClick={toggleHighContrast}
            aria-label="Toggle High Contrast Mode"
            title="Toggle High Contrast Mode"
            style={{ 
              borderColor: highContrast ? 'var(--accent-primary)' : 'var(--glass-border)',
              color: highContrast ? 'var(--accent-primary)' : 'var(--text-primary)'
            }}
          >
            <Eye size={20} />
          </button>
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <Suspense fallback={<div className="loading-shimmer" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />}>
              <Dashboard 
                stadium={selectedStadium} 
                onSectionSelect={setHighlightedSection} 
              />
              <div className="glass-card" style={{ padding: '1rem', marginTop: '2rem' }}>
                <VenueMap 
                  stadium={selectedStadium} 
                  highContrast={highContrast} 
                  highlightedSection={highlightedSection} 
                />
              </div>
            </Suspense>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <Suspense fallback={<div className="loading-shimmer" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />}>
             <Assistant stadium={selectedStadium} />
           </Suspense>
           
           <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Settings size={20} color="var(--accent-secondary)" />
                Venue Services
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Wi-Fi Access</span>
                  <strong>{selectedStadium.name.replace(/\s+/g, '')}_Guest</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Emergency Medical</span>
                  <strong>Section 104</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lost & Found</span>
                  <strong>Gate 1</strong>
                </li>
              </ul>
           </div>
        </div>
      </main>
    </div>
  );
}

export default App;
