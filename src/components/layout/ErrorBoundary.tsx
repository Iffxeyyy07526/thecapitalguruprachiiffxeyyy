'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-10 text-center bg-black/[0.02] border-white/[0.05] backdrop-blur-3xl animate-fade-in">
             <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-danger shadow-glow-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
             </div>
             <h2 className="text-2xl font-display font-bold text-white mb-2">Protocol Disruption</h2>
             <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-[0.2em] mb-6">Anomaly Detected / Local System Panic</p>
             <p className="text-sm text-secondary leading-relaxed mb-8">
               A critical exception occurred in the terminal execution. The operational node has been isolated to prevent data corruption.
             </p>
             <div className="space-y-4">
               <Button variant="primary" fullWidth size="lg" onClick={() => window.location.reload()}>
                 Restart Terminal
               </Button>
               <Button variant="ghost" fullWidth size="sm" onClick={() => this.setState({ hasError: false })}>
                 Acknowledge Anomaly
               </Button>
             </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
