/**
 * Client-side analytics tracking utility
 */

interface AnalyticsEvent {
  event_type: 'page_view' | 'click' | 'scroll' | 'download' | 'form_submit';
  page_path: string;
  page_title: string;
  referrer?: string;
  session_id: string;
  user_id?: string;
  additional_data?: Record<string, any>;
}

class AnalyticsTracker {
  private apiBaseUrl: string;
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean;

  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    this.sessionId = this.getOrCreateSessionId();
    this.isEnabled = false; // Start disabled, enable later
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = this.generateUUID();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  private initializeTracking(): void {
    if (!this.isEnabled) return;

    // Track initial page view
    this.trackPageView();

    // Track page changes for SPA
    this.trackSPANavigation();

    // Track scroll depth
    this.trackScrollDepth();

    // Track clicks on external links
    this.trackExternalLinks();
  }

  private trackSPANavigation(): void {
    // Override pushState and replaceState to track SPA navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(() => analyticsTracker.trackPageView(), 100);
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(() => analyticsTracker.trackPageView(), 100);
    };

    // Track back/forward button
    window.addEventListener('popstate', () => {
      setTimeout(() => this.trackPageView(), 100);
    });
  }

  private trackScrollDepth(): void {
    let maxScroll = 0;
    let scrollTimer: NodeJS.Timeout;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent;
          this.trackEvent('scroll', {
            scroll_depth: scrollPercent
          });
        }
      }, 250);
    });
  }

  private trackExternalLinks(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        this.trackEvent('click', {
          link_url: link.href,
          link_text: link.textContent?.trim() || '',
          external: true
        });
      }
    });
  }

  public trackPageView(): void {
    this.trackEvent('page_view');
  }

  public trackEvent(eventType: AnalyticsEvent['event_type'], additionalData?: Record<string, any>): void {
    if (!this.isEnabled || !this.apiBaseUrl) return;

    const event: AnalyticsEvent = {
      event_type: eventType,
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer,
      session_id: this.sessionId,
      user_id: this.userId,
      additional_data: additionalData
    };

    // Send to analytics API
    this.sendEvent(event);
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('download', {
      file_name: fileName,
      file_type: fileType
    });
  }

  public trackFormSubmit(formName: string, success: boolean): void {
    this.trackEvent('form_submit', {
      form_name: formName,
      success: success
    });
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch(`${this.apiBaseUrl}/track-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silently fail - don't break the user experience
      console.debug('Analytics tracking failed:', error);
    }
  }

  public enable(): void {
    this.isEnabled = true;
    // Initialize tracking when enabled
    this.initializeTracking();
  }

  public disable(): void {
    this.isEnabled = false;
  }
}

// Create global instance
export const analyticsTracker = new AnalyticsTracker();

// Export utility functions
export const trackPageView = () => analyticsTracker.trackPageView();
export const trackEvent = (eventType: AnalyticsEvent['event_type'], data?: Record<string, any>) => 
  analyticsTracker.trackEvent(eventType, data);
export const trackDownload = (fileName: string, fileType: string) => 
  analyticsTracker.trackDownload(fileName, fileType);
export const trackFormSubmit = (formName: string, success: boolean) => 
  analyticsTracker.trackFormSubmit(formName, success);
export const setUserId = (userId: string) => analyticsTracker.setUserId(userId);

export default analyticsTracker;