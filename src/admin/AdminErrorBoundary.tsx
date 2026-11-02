'use client';

import { Component } from 'react';

import SwitchToOldAdminButton from './components/SwitchToOldAdminButton';

import type { ErrorInfo, ReactNode } from 'react';

interface AdminErrorBoundaryProps {
  children: ReactNode;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
}

export default class AdminErrorBoundary extends Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  state: AdminErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AdminErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('The new admin failed to render.', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            alignItems: 'center',
            background: '#f5f4f3',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 24,
            textAlign: 'center'
          }}
        >
          <h1>The new admin could not be opened.</h1>
          <p>Switch to the old admin or reload this page to try again.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <SwitchToOldAdminButton />
            <button type="button" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
