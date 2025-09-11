import * as cheerio from 'cheerio';

export interface OpenGraphData {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogSiteName: string;
  ogType: string;
  ogUrl: string;
}

/**
 * Extract OpenGraph and fallback metadata using Cheerio
 */
export async function extractMetadataWithCheerio(url: string): Promise<OpenGraphData | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      signal: AbortSignal.timeout(8000), // 8 second timeout
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.trim().length === 0) {
      throw new Error('Empty HTML response');
    }

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract OpenGraph metadata with Cheerio selectors
    const ogTitle = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    const ogDescription = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    let ogImage = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      '';

    // Fallback to first meaningful image if no OG image found
    if (!ogImage) {
      // Try lazy-loaded images first
      ogImage = 
        $('img[data-src]').first().attr('data-src') ||
        $('img[data-original]').first().attr('data-original') ||
        $('img[data-lazy-src]').first().attr('data-lazy-src') ||
        $('img[src]').first().attr('src') ||
        '';
    }

    const ogSiteName = 
      $('meta[property="og:site_name"]').attr('content') ||
      '';

    const ogType = 
      $('meta[property="og:type"]').attr('content') ||
      'website';

    // Normalize relative URLs to absolute
    if (ogImage && !/^https?:\/\//i.test(ogImage)) {
      try {
        ogImage = new URL(ogImage, url).href;
      } catch (error) {
        console.warn('Failed to normalize image URL:', error);
        ogImage = '';
      }
    }

    // Clean up text content
    const cleanTitle = ogTitle.trim().replace(/\s+/g, ' ');
    const cleanDescription = ogDescription.trim().replace(/\s+/g, ' ');

    // Return extracted metadata if we have at least title or description
    if (cleanTitle || cleanDescription || ogImage) {
      return {
        ogTitle: cleanTitle,
        ogDescription: cleanDescription,
        ogImage: ogImage || '',
        ogSiteName: ogSiteName.trim(),
        ogType: ogType.trim(),
        ogUrl: url
      };
    }

    return null;

  } catch (error) {
    console.error('Error extracting metadata with Cheerio:', error);
    return null;
  }
}

/**
 * Create fallback metadata for when extraction fails
 */
export function createFallbackMetadata(url: string): OpenGraphData {
  const domain = new URL(url).hostname.replace('www.', '');
  
  // Enhanced detection for known journalism sites
  const knownSites: Record<string, { name: string; description: string }> = {
    'amazoniavox.com': { name: 'Amazônia Vox', description: 'Jornalismo independente da Amazônia' },
    'infoamazonia.org': { name: 'InfoAmazônia', description: 'Rede de jornalismo investigativo' },
    'agenciaamapa.com.br': { name: 'Agência Amapá', description: 'Notícias do Amapá' },
    'jornalismoagcom.com': { name: 'Jornalismo AGCom', description: 'Comunicação e jornalismo' },
    'g1.globo.com': { name: 'G1', description: 'Portal de notícias da Globo' },
    'folha.uol.com.br': { name: 'Folha de S.Paulo', description: 'Jornal Folha de S.Paulo' },
    'estadao.com.br': { name: 'O Estado de S. Paulo', description: 'Estadão' },
    'bbc.com': { name: 'BBC', description: 'BBC News' },
    'cnn.com': { name: 'CNN', description: 'CNN News' },
    'nytimes.com': { name: 'The New York Times', description: 'The New York Times' },
    'theguardian.com': { name: 'The Guardian', description: 'The Guardian' },
    'reuters.com': { name: 'Reuters', description: 'Reuters News' },
    'ap.news': { name: 'Associated Press', description: 'AP News' },
  };
  
  const siteInfo = knownSites[domain] || { 
    name: domain, 
    description: `Conteúdo de ${domain}` 
  };
  
  return {
    ogTitle: siteInfo.name,
    ogDescription: siteInfo.description,
    ogImage: '',
    ogSiteName: siteInfo.name,
    ogType: 'website',
    ogUrl: url
  };
}

/**
 * Try multiple URL variants to handle redirects and www prefixes
 */
export function generateUrlVariants(originalUrl: string): string[] {
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
