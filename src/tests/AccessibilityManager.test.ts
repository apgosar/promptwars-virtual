import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AccessibilityManager } from '../utils/AccessibilityManager';

describe('AccessibilityManager', () => {
  beforeEach(() => {
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

    // Clear localStorage before each test
    localStorage.clear();
    // Reset instance (hacky but works for singleton testing)
    // @ts-ignore
    AccessibilityManager.instance = undefined;
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-high-contrast');
  });

  it('initializes to false by default (assuming no OS override)', () => {
    const manager = AccessibilityManager.getInstance();
    expect(manager.isHighContrast()).toBe(false);
  });

  it('toggles high contrast mode and saves to localStorage', () => {
    const manager = AccessibilityManager.getInstance();
    
    expect(manager.toggleHighContrast()).toBe(true);
    expect(localStorage.getItem('accessibility.highContrast')).toBe('true');
    expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');

    expect(manager.toggleHighContrast()).toBe(false);
    expect(localStorage.getItem('accessibility.highContrast')).toBe('false');
    expect(document.documentElement.getAttribute('data-high-contrast')).toBe('false');
  });

  it('notifies subscribers when high contrast is toggled', () => {
    const manager = AccessibilityManager.getInstance();
    let listenerCalled = 0;
    let listenerValue = false;

    const unsub = manager.subscribe((val) => {
      listenerCalled++;
      listenerValue = val;
    });

    // Initial subscription calls immediately
    expect(listenerCalled).toBe(1);
    expect(listenerValue).toBe(false);

    manager.toggleHighContrast();

    expect(listenerCalled).toBe(2);
    expect(listenerValue).toBe(true);

    unsub();
  });
});
