export interface UrlMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  domain: string;
  favicon: string;
  siteName: string;
  type: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
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
 * Parse HTML and extract metadata
 */
function parseMetadata(html: string, url: string): UrlMetadata {
  const domain = getDomain(url);
  const favicon = getFaviconUrl(url);
  
  // Basic regex patterns to extract meta tags
  const getMetaContent = (property: string): string => {
    const patterns = [
      new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*?)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*?)["'][^>]*property=["']${property}["']`, 'i'),
      new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*?)["']`, 'i'),
      new RegExp(`<meta[^>]*content=["']([^"']*?)["'][^>]*name=["']${property}["']`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return '';
  };

  // Extract title
  let title = getMetaContent('og:title') || 
              getMetaContent('twitter:title') || 
              getMetaContent('title');
  
  if (!title) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    title = titleMatch ? titleMatch[1].trim() : domain;
  }

  // Extract description
  const description = getMetaContent('og:description') || 
                     getMetaContent('twitter:description') || 
                     getMetaContent('description') ||
                     '';

  // Extract image
  const image = getMetaContent('og:image') || 
               getMetaContent('twitter:image') || 
               getMetaContent('image') ||
               '';

  // Extract site name
  const siteName = getMetaContent('og:site_name') || 
                  getMetaContent('application-name') ||
                  domain;

  // Extract type
  const type = getMetaContent('og:type') || 'website';

  // Extract author
  const author = getMetaContent('author') || 
                getMetaContent('article:author') ||
                '';

  // Extract published time
  const publishedTime = getMetaContent('article:published_time') ||
                       getMetaContent('article:published') ||
                       '';

  // Extract modified time
  const modifiedTime = getMetaContent('article:modified_time') ||
                      getMetaContent('article:modified') ||
                      '';

  return {
    title: title || `Visit ${domain}`,
    description: description || `Content from ${domain}`,
    image: image || '',
    url,
    domain,
    favicon,
    siteName,
    type,
    author,
    publishedTime,
    modifiedTime
  };
}

/**
 * Fetch URL metadata with proper error handling
 */
export async function fetchUrlMetadata(url: string): Promise<UrlMetadata | null> {
  try {
    // Validate URL
    new URL(url);
    
    // For development/demo, we'll use a more robust approach
    // In production, you might want to use a service like linkpreview.net
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MetadataBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      // Follow redirects
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseMetadata(html, url);
    
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    
    // Return basic fallback metadata
    const domain = getDomain(url);
    const favicon = getFaviconUrl(url);
    
    return {
      title: `Visit ${domain}`,
      description: `Content from ${domain}`,
      image: '',
      url,
      domain,
      favicon,
      siteName: domain,
      type: 'website'
    };
  }
}

/**
 * Enhanced metadata with journalism-specific handling
 */
export function enhanceJournalismMetadata(metadata: UrlMetadata): UrlMetadata {
  const domain = metadata.domain.toLowerCase();
  let enhanced = { ...metadata };

  // News outlet specific enhancements
  const newsOutlets: Record<string, string> = {
    'nytimes.com': 'The New York Times',
    'washingtonpost.com': 'The Washington Post',
    'theguardian.com': 'The Guardian',
    'bbc.com': 'BBC',
    'bbc.co.uk': 'BBC',
    'cnn.com': 'CNN',
    'reuters.com': 'Reuters',
    'apnews.com': 'Associated Press',
    'theatlantic.com': 'The Atlantic',
    'newyorker.com': 'The New Yorker',
    'wired.com': 'WIRED',
    'vox.com': 'Vox',
    'medium.com': 'Medium',
    'substack.com': 'Substack'
  };

  // Check if it's a known news outlet
  for (const [outlet, name] of Object.entries(newsOutlets)) {
    if (domain.includes(outlet)) {
      enhanced.siteName = name;
      if (!enhanced.description.includes(name)) {
        enhanced.description = `Published in ${name} - ${enhanced.description}`;
      }
      break;
    }
  }

  // Special handling for specific platforms
  if (domain.includes('twitter.com') || domain.includes('x.com')) {
    enhanced.siteName = 'X (Twitter)';
    enhanced.type = 'social';
  } else if (domain.includes('linkedin.com')) {
    enhanced.siteName = 'LinkedIn';
    enhanced.type = 'professional';
  } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
    enhanced.siteName = 'YouTube';
    enhanced.type = 'video';
  } else if (domain.includes('spotify.com')) {
    enhanced.siteName = 'Spotify';
    enhanced.type = 'audio';
  }

  return enhanced;
}

/**
 * Cache metadata for performance
 */
const metadataCache = new Map<string, { data: UrlMetadata; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedUrlMetadata(url: string): Promise<UrlMetadata | null> {
  const cached = metadataCache.get(url);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const metadata = await fetchUrlMetadata(url);
  if (metadata) {
    const enhanced = enhanceJournalismMetadata(metadata);
    metadataCache.set(url, { data: enhanced, timestamp: Date.now() });
    return enhanced;
  }
  
  return null;
}