import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-6 text-center bg-[#1a1b26] text-gray-300">
        <AlertTriangle size={40} className="text-yellow-400" />
        <p className="font-semibold text-white">{this.props.appTitle} stopped responding</p>
        <p className="text-xs font-mono text-red-400 max-w-full break-words line-clamp-3">{this.state.error.message}</p>
        <button
          onClick={() => this.setState({ error: null })}
          className="mt-2 px-4 py-1.5 text-sm rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          Restart app
        </button>
      </div>
    );
  }
}
