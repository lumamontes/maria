import { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';
import ImageModal from './ImageModal';
import type { ProcessedImage } from '@/lib/imageUtils';

interface GalleryWithModalProps {
  images: ProcessedImage[];
  initialImageId?: string;
  currentIndex?: number;
}

export default function GalleryWithModal({ 
  images, 
  initialImageId, 
  currentIndex: initialIndex 
}: GalleryWithModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(!!initialImageId);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(initialIndex || 0);

  useEffect(() => {
    // If we have an initial image ID, show the modal
    if (initialImageId) {
      const index = images.findIndex(img => img.id === initialImageId);
      if (index !== -1) {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
      }
    }
  }, [initialImageId, images]);

  const openModal = (index: number) => {
    const image = images[index];
    setSelectedImageIndex(index);
    setIsModalOpen(true);
    // Navigate to the image URL
    navigate(`/gallery/p/${image.id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Navigate back to gallery
    navigate('/gallery');
  };

  const navigateToImage = (index: number) => {
    const image = images[index];
    setSelectedImageIndex(index);
    // Update URL without full page reload
    navigate(`/gallery/p/${image.id}`);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="mx-auto max-w-[1960px] p-4">
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => openModal(index)}
              className="relative mb-5 block w-full cursor-zoom-in group after:content-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Ver detalhes da imagem: ${image.title || 'Imagem da galeria'}`}
            >
              <img
                src={image.url}
                alt={image.title || 'Imagem da galeria'}
                className="transform rounded-lg brightness-90 transition group-hover:brightness-110 w-full h-auto object-cover"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                loading="lazy"
                decoding="async"
              />
              
              {/* Overlay with image info on hover */}
              {(image.title || image.description) && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
                  <div className="p-4 text-white">
                    {image.title && (
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {image.title}
                      </h3>
                    )}
                    {image.description && (
                      <p className="text-xs opacity-90 line-clamp-3">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ImageModal
        image={images[selectedImageIndex]}
        isOpen={isModalOpen}
        onClose={closeModal}
        images={images}
        currentIndex={selectedImageIndex}
        onNavigate={navigateToImage}
      />
    </>
  );
}