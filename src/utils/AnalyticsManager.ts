/**
 * AnalyticsManager
 * 
 * A wrapper for tracking user events and page views.
 * For this hackathon, we'll log to console in dev and 
 * can easily connect to GA4 measurement ID in production.
 */
class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isInitialized: boolean = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  private init() {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId && typeof window !== 'undefined') {
      // In a real app, you'd load gtag.js here
      console.log(`[Analytics] Initialized with ID: ${measurementId}`);
      this.isInitialized = true;
    }
  }

  /**
   * Tracks a custom event.
   * @param {string} eventName - Name of the event.
   * @param {Record<string, any>} params - Custom parameters for the event.
   */
  public trackEvent(eventName: string, params: Record<string, any> = {}) {
    console.log(`[Analytics Event] ${eventName}`, params);
    
    if (this.isInitialized && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
  }

  /**
   * Tracks a page view or stadium selection.
   * @param {string} stadiumId - The ID of the stadium being viewed.
   */
  public trackStadiumView(stadiumId: string) {
    this.trackEvent('view_stadium', { stadium_id: stadiumId });
  }
}

export const analytics = AnalyticsManager.getInstance();
