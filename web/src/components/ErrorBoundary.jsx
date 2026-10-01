import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  handleReload = () => {
    window.location.href = '/';
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-6">
          <div className="card max-w-md text-center py-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-danger-light flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-danger" />
            </div>
            <h1 className="text-xl font-bold text-ink-primary mb-2">
              Something went wrong
            </h1>
            <p className="text-ink-secondary mb-6 text-sm">
              An unexpected error occurred. Please reload the page.
            </p>
            <button onClick={this.handleReload} className="btn btn-primary">
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
