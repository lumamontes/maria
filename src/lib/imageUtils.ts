interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details: {
        image?: {
          width: number;
          height: number;
        };
      };
      contentType: string;
    };
  };
}

export interface ProcessedImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

/**
 * Normalize Contentful URL to ensure it has the correct protocol
 */
export function normalizeContentfulUrl(url: string): string {
  if (!url) return '';
  
  // If URL already has a protocol, return as-is
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url;
  }
  
  // If URL starts with //, add https:
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // If URL is relative, add https://
  return `https://${url}`;
}

/**
 * Process Contentful assets into a standardized image format
 */
export function processContentfulImages(assets: ContentfulAsset[]): ProcessedImage[] {
  return assets
    .filter(asset => asset?.fields?.file?.url)
    .map((asset, index) => ({
      id: asset.fields.title || asset.sys.id || `image-${index}`,
      url: normalizeContentfulUrl(asset.fields.file.url),
      title: asset.fields.title,
      description: asset.fields.description,
      width: asset.fields.file.details.image?.width,
      height: asset.fields.file.details.image?.height,
    }));
}

/**
 * Generate a simple blur placeholder
 */
export function generateBlurDataUrl(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a simple gradient as placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
}

/**
 * Create a simple SVG blur placeholder
 */
export function createSvgBlurPlaceholder(width: number = 400, height: number = 300): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Preload images for better performance
 */
export function preloadImages(urls: string[], callback?: () => void): void {
  let loadedCount = 0;
  const totalCount = urls.length;
  
  if (totalCount === 0) {
    callback?.();
    return;
  }
  
  urls.forEach(url => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedCount++;
      if (loadedCount === totalCount) {
        callback?.();
      }
    };
    img.src = url;
  });
}

/**
 * Get optimized image URL from Contentful
 */
export function getOptimizedImageUrl(
  baseUrl: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
    fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  } = {}
): string {
  const { width, height, quality = 80, format, fit = 'fill' } = options;
  
  const params = new URLSearchParams();
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (quality) params.append('q', quality.toString());
  if (format) params.append('fm', format);
  if (fit) params.append('fit', fit);
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Calculate aspect ratio class for Tailwind
 */
export function getAspectRatioClass(width?: number, height?: number): string {
  if (!width || !height) return 'aspect-square';
  
  const ratio = width / height;
  
  if (ratio > 1.7) return 'aspect-video'; // 16:9 or wider
  if (ratio > 1.4) return 'aspect-[3/2]'; // 3:2
  if (ratio > 1.2) return 'aspect-[4/3]'; // 4:3
  if (ratio > 0.9) return 'aspect-square'; // Square-ish
  if (ratio > 0.7) return 'aspect-[3/4]'; // Portrait 3:4
  
  return 'aspect-[9/16]'; // Portrait or taller
}
