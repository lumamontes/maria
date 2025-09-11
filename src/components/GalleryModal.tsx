import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';

interface ImageData {
  id: string;
  url: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface GalleryModalProps {
  images: ImageData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryModal({ images, currentIndex, isOpen, onClose, onNavigate }: GalleryModalProps) {
  const [loaded, setLoaded] = useState(false);
  const [direction, setDirection] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset loaded state when image changes
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            setDirection(-1);
            onNavigate(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            setDirection(1);
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      onNavigate(currentIndex + 1);
    }
  };

  const handleDownload = () => {
    const currentImage = images[currentIndex];
    if (currentImage) {
      window.open(currentImage.url, '_blank');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];

  const modalContent = (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full">
          <img
            src={currentImage.url}
            alt={currentImage.title || `Gallery image ${currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLoaded(true)}
            style={{
              transform: `translateX(${direction * 10}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          />
          
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            title="Open full size"
            aria-label="Open full size image"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute top-4 left-4">
          <button
            onClick={onClose}
            className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="rounded-full bg-black/50 px-4 py-2 text-white/75 backdrop-blur-lg">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex justify-center">
          <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onNavigate(index)}
                className={`relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                  index === currentIndex
                    ? 'scale-125 ring-2 ring-white/50'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-14 w-14 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}
