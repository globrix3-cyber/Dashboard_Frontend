import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-8 py-3 rounded-2xl font-semibold text-sm hover:scale-105 transition-transform"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}