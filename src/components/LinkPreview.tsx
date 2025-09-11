import { useState } from 'react';
import type { LinkPreview } from '../lib/linkPreview';

interface LinkPreviewCardProps {
  url: string;
  title?: string;
  description?: string;
  banner?: string;
  className?: string;
}

export function LinkPreviewCard({ url, title, description, banner, className = '' }: LinkPreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // Extract domain from URL
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  };

  // Get favicon URL
  const getFaviconUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return '';
    }
  };

  // Enhanced preview based on domain - optimized for journalism
  const getEnhancedPreview = () => {
    const domain = getDomain(url);
    let enhancedTitle = title || domain;
    let enhancedDescription = description || '';
    let previewImage = banner || '';
    let publicationType = 'Article';

    publicationType = 'Publication';
    enhancedDescription = description || `Published on ${domain}`;

    return {
      title: enhancedTitle,
      description: enhancedDescription,
      image: previewImage,
      domain,
      publicationType
    };
  };

  const preview = getEnhancedPreview();
  const faviconUrl = getFaviconUrl(url);

  return (
    <a
      href={url}
      target={url.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={`group block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Preview Image */}
      {preview.image && !imageError && (
        <div className="aspect-video overflow-hidden">
          <img
            src={preview.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {preview.title}
        </h3>

        {/* Description */}
        {preview.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {preview.description}
          </p>
        )}

        {/* Footer with publication info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {faviconUrl && !faviconError && (
              <img
                src={faviconUrl}
                alt=""
                className="w-4 h-4"
                onError={() => setFaviconError(true)}
              />
            )}
            <div className="text-xs">
              <div className="font-medium text-blue-600">{preview.publicationType}</div>
              <div className="text-gray-500">{preview.domain}</div>
            </div>
          </div>

          {/* External link icon */}
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span>Read</span>
            <svg
              className="w-4 h-4 group-hover:text-blue-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}

// Alternative compact version for smaller spaces
export function CompactLinkPreview({ url, title, description, className = '' }: LinkPreviewCardProps) {
  const [faviconError, setFaviconError] = useState(false);

  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'External Link';
    }
  };

  const getFaviconUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return '';
    }
  };

  const domain = getDomain(url);
  const faviconUrl = getFaviconUrl(url);

  return (
    <a
      href={url}
      target={url.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={`group flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {/* Favicon */}
      <div className="flex-shrink-0">
        {faviconUrl && !faviconError ? (
          <img
            src={faviconUrl}
            alt=""
            className="w-6 h-6"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {title || domain}
        </h4>
        {description && (
          <p className="text-sm text-gray-500 truncate">
            {description}
          </p>
        )}
        <p className="text-xs text-gray-400">
          {domain}
        </p>
      </div>

      {/* External link icon */}
      <div className="flex-shrink-0">
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </a>
  );
}