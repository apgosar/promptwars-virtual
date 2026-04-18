import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveScore } from '../components/Dashboard/LiveScore';

describe('LiveScore Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with default teams and scores', () => {
    render(<LiveScore />);
    
    expect(screen.getByText('Championship Final')).toBeDefined();
    expect(screen.getByText('IND')).toBeDefined();
    expect(screen.getByText('AUS')).toBeDefined();
    expect(screen.getByText('214')).toBeDefined();
    expect(screen.getByText('186')).toBeDefined();
  });

  it('toggles the live indicator pulse', () => {
    // This is more to ensure the useEffect doesn't crash or leak.
    render(<LiveScore />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Can't easily test visual pulse with pure HTML assertions, but we know interval ran
    expect(screen.getByText('Live')).toBeDefined();
  });
});
