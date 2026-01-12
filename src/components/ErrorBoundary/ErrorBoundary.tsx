import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="text-center p-8 max-w-lg mx-auto my-8" role="alert">
          <h2 className="m-0 mb-4 text-2xl text-red-500">
            Something went wrong
          </h2>
          <p className="m-0 mb-6 text-slate-500">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            className="py-2 px-6 text-sm font-medium text-white bg-blue-500 border-none rounded-lg cursor-pointer transition-colors duration-200 hover:bg-blue-600 focus-visible:outline-3 focus-visible:outline-slate-800 focus-visible:outline-offset-2"
            onClick={this.handleReset}
            type="button"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
