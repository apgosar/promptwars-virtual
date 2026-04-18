import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationToast } from './components/NotificationToast';
import { AccessibilityManager } from './utils/AccessibilityManager';
import { analytics } from './utils/AnalyticsManager';
import stadiumData from './data/stadiums.json';
import type { Stadium } from './types';
import { Map as MapIcon, Settings, Eye } from 'lucide-react';

// Lazy load heavy components
const VenueMap = lazy(() => import('./components/Map/VenueMap').then(module => ({ default: module.VenueMap })));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const Assistant = lazy(() => import('./components/Assistant/Assistant').then(module => ({ default: module.Assistant })));

/**
 * Main Application component for EventXP.
 * Manages venue selection, high contrast state, and global layout.
 */
function App() {
  const [stadiums] = useState<Stadium[]>(stadiumData.stadiums as Stadium[]);
  const [selectedStadium, setSelectedStadium] = useState<Stadium>(stadiums[0]);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [highlightedSection, setHighlightedSection] = useState<string | undefined>();
  const [accessibilityManager] = useState(() => AccessibilityManager.getInstance());

  useEffect(() => {
    const unsub = accessibilityManager.subscribe(enabled => {
      setHighContrast(enabled);
    });
    
    // Initial tracking
    analytics.trackStadiumView(selectedStadium.id);
    
    return unsub;
  }, [accessibilityManager, selectedStadium.id]);

  /**
   * Toggles the global high contrast theme.
   */
  const toggleHighContrast = () => {
    const newState = accessibilityManager.toggleHighContrast();
    analytics.trackEvent('toggle_high_contrast', { enabled: newState });
  };

  /**
   * Handles stadium selection and tracking.
   */
  const handleStadiumChange = (id: string) => {
    const stadium = stadiums.find(s => s.id === id);
    if (stadium) {
      setSelectedStadium(stadium);
      setHighlightedSection(undefined);
      analytics.trackStadiumView(stadium.id);
    }
  };

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MapIcon size={36} color="var(--accent-primary)" aria-hidden="true" />
          <div>
            <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EventXP
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Premium Venue Portal</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <label htmlFor="venue-select" className="sr-only">Select stadium venue</label>
            <select 
              id="venue-select"
              className="custom-input" 
              style={{ width: 'auto', background: 'var(--glass-bg)' }}
              value={selectedStadium.id}
              onChange={(e) => handleStadiumChange(e.target.value)}
            >
              {stadiums.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          
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
            <Eye size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main-content" role="main" tabIndex={-1} style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', outline: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Suspense fallback={<div className="loading-shimmer" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />}>
            <Dashboard 
              stadium={selectedStadium} 
              onSectionSelect={setHighlightedSection} 
            />
          </Suspense>

          <ErrorBoundary>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <Suspense fallback={<div className="loading-shimmer" style={{ height: '500px', borderRadius: 'var(--radius-lg)' }} />}>
                <VenueMap 
                  stadium={selectedStadium} 
                  highContrast={highContrast} 
                  highlightedSection={highlightedSection} 
                />
              </Suspense>
            </div>
          </ErrorBoundary>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <Suspense fallback={<div className="loading-shimmer" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />}>
             <Assistant stadium={selectedStadium} />
           </Suspense>
           
           <section className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Settings size={20} color="var(--accent-secondary)" aria-hidden="true" />
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
           </section>
        </aside>
      </main>

      <NotificationToast message="Heavy congestion reported near Gate 1. Please consider using Gate 2 if available." />
    </div>
  );
}

export default App;
