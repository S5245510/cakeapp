'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error?: Error;
    resetError: () => void;
  }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          {isDevelopment && error && (
            <details className="bg-gray-100 p-3 rounded text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <pre className="whitespace-pre-wrap text-xs text-gray-600 overflow-auto">
                {error.toString()}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex gap-3 justify-center">
            <Button onClick={resetError} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button asChild className="flex items-center gap-2">
              <a href="/">
                <Home className="w-4 h-4" />
                Go Home
              </a>
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            If this problem persists, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Specialized error boundaries for different parts of the app

export function ProductErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <Card className="p-6">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">Failed to load products</h3>
            <p className="text-gray-600 text-sm mb-4">
              There was an error loading the product information.
            </p>
            <Button onClick={resetError} size="sm">
              Try Again
            </Button>
          </div>
        </Card>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function CheckoutErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Checkout Error</h2>
              <p className="text-gray-600 mb-4">
                There was an issue processing your checkout. Your cart items are safe.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetError} variant="outline">
                  Try Again
                </Button>
                <Button asChild>
                  <a href="/cart">View Cart</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

export function AdminErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-medium mb-2">Admin Panel Error</h3>
              <p className="text-gray-600 text-sm mb-4">
                There was an error in the admin interface.
              </p>
              <Button onClick={resetError} size="sm">
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}