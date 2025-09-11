export interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  domain: string;
  favicon: string;
}

/**
 * Extract domain from URL
 */
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * Get favicon URL for a domain
 */
function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
  } catch {
    return '';
  }
}

/**
 * Fetch link metadata using a free service (linkpreview.net alternative)
 * For production, consider using a paid service or building your own scraper
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  try {
    // Validate URL
    new URL(url);
    
    const domain = getDomain(url);
    const favicon = getFaviconUrl(url);
    
    // For now, return a basic preview with domain info
    // In production, you'd want to use a service like:
    // - LinkPreview.net
    // - OpenGraph.io  
    // - Your own scraper
    
    return {
      title: `Visit ${domain}`,
      description: `External link to ${domain}`,
      image: '',
      url: url,
      domain: domain,
      favicon: favicon
    };
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
}

/**
 * Enhanced function that attempts to extract metadata from common patterns
 */
export function createEnhancedPreview(url: string, title?: string, description?: string): LinkPreview {
  const domain = getDomain(url);
  const favicon = getFaviconUrl(url);
  
  // Enhanced title based on domain patterns
  let enhancedTitle = title || `Visit ${domain}`;
  let enhancedDescription = description || '';
  let previewImage = '';
  
  // Domain-specific enhancements
  if (domain.includes('github.com')) {
    const pathParts = new URL(url).pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      enhancedTitle = title || `${pathParts[0]}/${pathParts[1]}`;
      enhancedDescription = description || 'GitHub Repository';
      previewImage = `https://opengraph.githubassets.com/1/${pathParts[0]}/${pathParts[1]}`;
    }
  } else if (domain.includes('linkedin.com')) {
    enhancedTitle = title || 'LinkedIn Profile';
    enhancedDescription = description || 'Professional profile on LinkedIn';
  } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
    enhancedTitle = title || 'Twitter/X Post';
    enhancedDescription = description || 'View this post on Twitter/X';
  } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
    enhancedTitle = title || 'YouTube Video';
    enhancedDescription = description || 'Watch this video on YouTube';
  } else if (domain.includes('medium.com')) {
    enhancedTitle = title || 'Medium Article';
    enhancedDescription = description || 'Read this article on Medium';
  } else if (domain.includes('dev.to')) {
    enhancedTitle = title || 'Dev.to Article';
    enhancedDescription = description || 'Read this article on Dev.to';
  } else if (domain.includes('arxiv.org')) {
    enhancedTitle = title || 'arXiv Paper';
    enhancedDescription = description || 'Academic paper on arXiv';
  } else if (domain.includes('researchgate.net')) {
    enhancedTitle = title || 'ResearchGate Publication';
    enhancedDescription = description || 'Academic publication on ResearchGate';
  }
  
  return {
    title: enhancedTitle,
    description: enhancedDescription,
    image: previewImage,
    url: url,
    domain: domain,
    favicon: favicon
  };
}