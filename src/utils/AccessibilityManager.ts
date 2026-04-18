export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private highContrast: boolean = false;
  private listeners: ((enabled: boolean) => void)[] = [];

  private constructor() {
    // Check saved preference or OS level preference
    const saved = localStorage.getItem('accessibility.highContrast');
    if (saved !== null) {
      this.highContrast = saved === 'true';
    } else {
      this.highContrast = !!(window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches);
    }
    this.applyTheme();
  }

  public static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  public isHighContrast(): boolean {
    return this.highContrast;
  }

  public toggleHighContrast(): boolean {
    this.highContrast = !this.highContrast;
    localStorage.setItem('accessibility.highContrast', this.highContrast.toString());
    this.applyTheme();
    this.notifyListeners();
    return this.highContrast;
  }

  private applyTheme() {
    const root = document.documentElement;
    root.setAttribute('data-high-contrast', this.highContrast ? 'true' : 'false');
  }

  public subscribe(listener: (enabled: boolean) => void) {
    this.listeners.push(listener);
    // Initial call
    listener(this.highContrast);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l(this.highContrast));
  }
}
