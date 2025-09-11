import React, { Suspense } from 'react';
import { AutoLinkPreview } from './AutoLinkPreview';

interface AutoLinkPreviewWrapperProps {
  url: string;
  className?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  tags?: string[];
}

// Loading component for Suspense fallback
const LoadingPreview: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
    <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
    <div className="p-6">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="text-xs text-gray-500">Carregando informações...</div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<any> },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ComponentType<any> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AutoLinkPreview Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      return <Fallback />;
    }

    return this.props.children;
  }
}

// Simple fallback component for errors
const ErrorFallback: React.FC<AutoLinkPreviewWrapperProps> = ({ 
  url, 
  className = '', 
  fallbackTitle,
  fallbackDescription,
  fallbackImage 
}) => {
  const getDomain = (url: string): string => {
    try { 
      return new URL(url).hostname.replace('www.', ''); 
    } catch { 
      return 'External Link'; 
    }
  };

  const domain = getDomain(url);
  const title = fallbackTitle || domain;
  const description = fallbackDescription || `Conteúdo de ${domain}`;

  return (
    <a 
      href={url} 
      target={url.startsWith('http') ? '_blank' : undefined} 
      rel="noopener noreferrer" 
      className={`group block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}
    >
      {fallbackImage && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img 
            src={fallbackImage} 
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            loading="lazy" 
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-xs">
            <div className="font-medium text-blue-600">{domain}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>Ler</span>
              <svg className="w-4 h-4 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export const AutoLinkPreviewWrapper: React.FC<AutoLinkPreviewWrapperProps> = (props) => {
  return (
    <AutoLinkPreview {...props} />
  );
};

export default AutoLinkPreviewWrapper;
