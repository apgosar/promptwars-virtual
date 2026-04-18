import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../components/Dashboard/Dashboard';
import type { Stadium } from '../types';

const mockStadium: Stadium = {
  id: 'test',
  name: 'Test Stadium',
  location: { lat: 0, lng: 0 },
  zoom: 15,
  gates: [
    { id: 'g1', name: 'Gate 1', lat: 0.1, lng: 0.1, closestSections: ['A1', 'A2'] }
  ],
  amenities: [
    { id: 'a1', type: 'food', name: 'Hot Dogs', lat: 0.05, lng: 0.05, wait_time_mins: 5 }
  ]
};

describe('Dashboard Component', () => {
  it('renders welcome message and input', () => {
    render(<Dashboard stadium={mockStadium} onSectionSelect={() => {}} />);
    expect(screen.getByText(/Digital Ticket/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. VIP/i)).toBeDefined();
  });

  it('calculates the best gate after scanning', () => {
    const onSelect = vi.fn();
    render(<Dashboard stadium={mockStadium} onSectionSelect={onSelect} />);
    
    const input = screen.getByPlaceholderText(/e\.g\. VIP/i);
    const button = screen.getByText('Scan');

    fireEvent.change(input, { target: { value: 'A1' } });
    fireEvent.click(button);

    expect(screen.getByText(/Route Optimized/i)).toBeDefined();
    expect(screen.getByText('Gate 1')).toBeDefined();
    expect(onSelect).toHaveBeenCalledWith('A1');
  });

  it('displays congestion panel with amenity status', () => {
    render(<Dashboard stadium={mockStadium} onSectionSelect={() => {}} />);
    expect(screen.getByText(/Venue Live Status/i)).toBeDefined();
    expect(screen.getByText('Hot Dogs')).toBeDefined();
    expect(screen.getByText('Fast')).toBeDefined(); // Since wait time < 10
  });
});
