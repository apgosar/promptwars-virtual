import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Generic Error Boundary component to catch JavaScript errors in child components.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
          <h2>Something went wrong.</h2>
          <p>We're having trouble loading this component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
