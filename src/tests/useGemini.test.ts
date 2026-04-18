import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useGemini } from '../hooks/useGemini';
import type { Stadium } from '../types';

// Mock the environment variable
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');

// Mock GoogleGenerativeAI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: { text: () => 'Mocked Gemini Response' }
      })
    })
  }))
}));

const mockStadium: Stadium = {
  id: 'test',
  name: 'Test Stadium',
  location: { lat: 0, lng: 0 },
  zoom: 15,
  gates: [],
  amenities: []
};

describe('useGemini Hook', () => {
  it('initializes with the welcome message', () => {
    const { result } = renderHook(() => useGemini('Welcome'));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('Welcome');
    expect(result.current.loading).toBe(false);
  });

  it('adds user message and fetches response', async () => {
    const { result } = renderHook(() => useGemini('Welcome'));

    await act(async () => {
      await result.current.sendMessage('Where is the food?', mockStadium);
    });

    // Should have Welcome, User Query, and Assistant Response
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1].text).toBe('Where is the food?');
    expect(result.current.messages[2].text).toBe('Mocked Gemini Response');
    expect(result.current.loading).toBe(false);
  });

  it('ignores empty queries', async () => {
    const { result } = renderHook(() => useGemini('Welcome'));

    await act(async () => {
      await result.current.sendMessage('   ', mockStadium);
    });

    expect(result.current.messages).toHaveLength(1); // Still just welcome
  });
});
