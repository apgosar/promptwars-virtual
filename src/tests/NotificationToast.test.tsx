import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationToast } from '../components/NotificationToast';

describe('NotificationToast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is initially hidden and appears after delay', () => {
    render(<NotificationToast message="Test Alert" />);
    
    // Should not be visible initially
    expect(screen.queryByText('Test Alert')).toBeNull();

    // Fast-forward 5 seconds (the initial simulated delay)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should now be visible
    expect(screen.getByText('Test Alert')).toBeDefined();
    expect(screen.getByText('CROWD FLOW ALERT')).toBeDefined();
  });

  it('hides after the specified duration', () => {
    render(<NotificationToast message="Test Alert" duration={3000} />);
    
    // Appear
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.queryByText('Test Alert')).toBeDefined();

    // Disappear after duration (3000ms)
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.queryByText('Test Alert')).toBeNull();
  });
});
