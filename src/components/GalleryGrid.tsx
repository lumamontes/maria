import { useState, useEffect } from 'react';
import { GalleryModal } from './GalleryModal';

interface ImageData {
  id: string;
  url: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface GalleryGridProps {
  images: ImageData[];
  layout?: 'masonry' | 'grid';
  columns?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export function GalleryGrid({ 
  images, 
  layout = 'masonry',
  columns = { sm: 2, md: 3, lg: 4, xl: 5 }
}: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const openModal = (index: number) => {
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedIndex(null);
  };

  const navigateModal = (index: number) => {
    setSelectedIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto max-w-md">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No photos yet
          </h3>
          <p className="text-gray-600">
            Check back soon for beautiful images!
          </p>
        </div>
      </div>
    );
  }

  if (layout === 'masonry') {
    const masonryClasses = `columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4`;
    
    return (
      <>
        <div className={masonryClasses}>
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="break-inside-avoid mb-4 group cursor-pointer"
              onClick={() => openModal(index)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
                <img
                  src={image.url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  className={`w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ${
                    loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(image.id)}
                  loading={index < 8 ? "eager" : "lazy"}
                />
                
                {!loadedImages.has(image.id) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    {image.title && (
                      <p className="text-white text-sm font-medium truncate">
                        {image.title}
                      </p>
                    )}
                    <p className="text-white/80 text-xs mt-1">
                      Click to view full size
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <GalleryModal
          images={images}
          currentIndex={selectedIndex || 0}
          isOpen={selectedIndex !== null}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      </>
    );
  }

  const gridClasses = `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8`;
  
  return (
    <>
      <div className={gridClasses}>
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => openModal(index)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={image.url}
                alt={image.title || `Gallery image ${index + 1}`}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(image.id)}
                loading={index < 8 ? "eager" : "lazy"}
              />
              
              {!loadedImages.has(image.id) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                {image.title && (
                  <p className="text-white text-sm font-medium truncate mb-1">
                    {image.title}
                  </p>
                )}
                <p className="text-white/80 text-xs">
                  Clique para ver a imagem completa
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <GalleryModal
        images={images}
        currentIndex={selectedIndex || 0}
        isOpen={selectedIndex !== null}
        onClose={closeModal}
        onNavigate={navigateModal}
      />
    </>
  );
}
