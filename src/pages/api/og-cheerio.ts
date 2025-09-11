import type { APIRoute } from 'astro';
import { extractMetadataWithCheerio, generateUrlVariants, createFallbackMetadata } from '../../lib/ogExtractor';

/**
 * Enhanced OpenGraph metadata extraction using Cheerio for robust HTML parsing
 * This provides more reliable parsing compared to regex-based approaches
 */

export interface OpenGraphData {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogSiteName: string;
  ogType: string;
  ogUrl: string;
}

/**
 * Try multiple URL variants to handle redirects and www prefixes
 */
function generateUrlVariants(originalUrl: string): string[] {
  try {
    const url = new URL(originalUrl);
    const variants = new Set<string>([originalUrl]);
    
    // Add www variant
    if (url.hostname.startsWith('www.')) {
      const withoutWww = new URL(originalUrl);
      withoutWww.hostname = url.hostname.replace('www.', '');
      variants.add(withoutWww.toString());
    } else {
      const withWww = new URL(originalUrl);
      withWww.hostname = `www.${url.hostname}`;
      variants.add(withWww.toString());
    }
    
    // Add https/http variants
    if (url.protocol === 'http:') {
      const httpsUrl = new URL(originalUrl);
      httpsUrl.protocol = 'https:';
      variants.add(httpsUrl.toString());
    } else if (url.protocol === 'https:') {
      const httpUrl = new URL(originalUrl);
      httpUrl.protocol = 'http:';
      variants.add(httpUrl.toString());
    }
    
    return Array.from(variants);
  } catch {
    return [originalUrl];
  }
}

export const GET: APIRoute = async ({ request, url, originPathname,  }) => {
  console.log('Origin Pathname:', originPathname);
  console.log('Request URL:', request.url);
  console.log('Astro URL:', url.href);
  console.log('Search params:', Array.from(url.searchParams.entries()));
  const targetUrl = url.searchParams.get('url');
  console.log('Target URL:', targetUrl);
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Validate URL format
  try {
    new URL(targetUrl);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL format' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Try multiple URL variants to handle redirects and common variations
    const urlVariants = generateUrlVariants(targetUrl);
    let metadata: OpenGraphData | null = null;
    
    for (const variant of urlVariants) {
      metadata = await extractMetadataWithCheerio(variant);
    console.log('metadata', metadata);

      if (metadata && (metadata.ogTitle || metadata.ogDescription || metadata.ogImage)) {
        break;
      }
    }
    
    // If no metadata found, use enhanced fallback
    if (!metadata || (!metadata.ogTitle && !metadata.ogDescription && !metadata.ogImage)) {
      metadata = createFallbackMetadata(targetUrl);
    }
    
    return new Response(JSON.stringify(metadata), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400', // Cache for 1 hour, stale for 24 hours
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept-Encoding',
      },
    });
    
  } catch (error) {
    console.error('Error in og-cheerio endpoint:', error);
    
    // Return fallback metadata instead of error
    const fallbackMetadata = createFallbackMetadata(targetUrl);
    
    return new Response(JSON.stringify(fallbackMetadata), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

// Handle preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, User-Agent',
      'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    },
  });
};
