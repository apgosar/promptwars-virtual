import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

describe('App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly and allows theme toggling', () => {
    render(<App />);
    
    expect(screen.getByText('EventXP')).toBeDefined();
    
    const toggleBtn = screen.getByLabelText(/Toggle High Contrast/i);
    fireEvent.click(toggleBtn);
    
    expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
  });

  it('allows switching stadiums', () => {
    render(<App />);
    const select = screen.getByLabelText(/Select stadium venue/i);
    
    // Switch to second stadium (assuming Narendra Modi Stadium is second)
    fireEvent.change(select, { target: { value: 'nmd_stadium' } });
    
    expect(screen.getAllByText(/Narendra Modi Stadium/i).length).toBeGreaterThan(0);
  });
});
