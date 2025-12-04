import { useState, useEffect } from 'react';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import clsx from 'clsx';
import { Button } from 'components/ui';

const RenderImage = ({
  id,
  preview,
  value,
  label = '',
  maxWidth = '100px',
  maxHeight = '100px',
  enableModal = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageSrc = preview ? preview : value;

  const handleImageLoad = (e) => {
    const skeleton = e.target.nextSibling;

    if (skeleton) {
      skeleton.style.display = 'none';
    }
    e.target.style.display = 'block';
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/images/no-image.png';
    const skeleton = e.target.nextSibling;
    if (skeleton) {
      skeleton.style.display = 'none';
    }
    e.target.style.display = 'block';
  };

  const handleImageClick = () => {
    if (enableModal) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    (preview || value !== '') && (
      <>
        <label htmlFor={'providerImage'} className={clsx('input-label')}>
          <span className={clsx('input-label')}>{label}</span>
        </label>
        <img
          id={id}
          src={imageSrc}
          className={clsx('img-thumbnail mb-2 mr-2 rounded', {
            'cursor-pointer transition-opacity hover:opacity-80': enableModal
          })}
          style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
          alt={'null'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onClick={handleImageClick}
        />
        <Skeleton
          height={100}
          width={100}
          baseColor="#e6eaeb"
          style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
        />

        {/* Image Modal */}
        {enableModal && (
          <Transition appear show={isModalOpen}>
            <Dialog
              as="div"
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
              onClose={handleCloseModal}>
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur transition-opacity dark:bg-black/40" />
              </TransitionChild>

              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <div className="relative flex items-center justify-center">
                  {/* Close Button */}
                  <Button
                    onClick={handleCloseModal}
                    variant="flat"
                    isIcon
                    className="absolute -top-12 right-0 z-10 size-10 rounded-full bg-white hover:bg-gray-100 dark:bg-dark-600 dark:hover:bg-dark-500">
                    <XMarkIcon className="size-6" />
                  </Button>

                  {/* Fixed Size Modal Container */}
                  <div className="flex h-[400px] w-[320px] items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-2xl dark:bg-dark-700 sm:h-[600px] sm:w-[800px]">
                    {/* Image */}
                    <img
                      src={imageSrc}
                      alt="Full size preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </TransitionChild>
            </Dialog>
          </Transition>
        )}
      </>
    )
  );
};
export default RenderImage;
