import { useState, useEffect } from 'react';

import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from 'components/ui';
import apiConfig from 'configs/api.config';
import clsx from 'clsx';
// import { toast } from 'sonner';

export const ShowImage = ({
  destPath,
  imageKey,
  // maxWidth = '250px',
  // maxHeight = '75px',
  // width = '',
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageSrc = `${apiConfig.baseURL.S3_URL}/${destPath}/${imageKey}`;

  const handleImageClick = () => {
    setIsModalOpen(true);
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

  // const handleDownload = async () => {
  //   try {
  //     const response = await fetch(imageSrc);
  //     if (!response.ok) throw new Error('Network response was not ok');
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = imageKey?.split('/').pop() || 'download';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //     toast.error('Direct download not supported by server. Opening in new tab.');
  //     window.open(imageSrc, '_blank');
  //   }
  // };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc, {
        method: 'GET',
        credentials: 'omit'
      });
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageKey.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // toast.error('Direct download not supported by server. Opening in new tab.');
      window.open(imageSrc, '_blank');
    }
  };

  return (
    <>
      <img
        src={imageSrc}
        alt={'invalid image'}
        className={clsx(className, 'cursor-pointer transition-opacity hover:opacity-80')}
        onClick={handleImageClick}
        // style={{ maxWidth: maxWidth, maxHeight: maxHeight, width: width }}
      />

      {/* Image Modal */}
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
              <div className="flex h-[400px] w-[320px] flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-4 shadow-2xl dark:bg-dark-700 sm:h-[600px] sm:w-[800px]">
                {/* Image */}
                <div className="flex h-full w-full flex-1 items-center justify-center overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Full size preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                {/* Download Button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="soft"
                    isIcon
                    className="size-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-dark-600 dark:hover:bg-dark-500">
                    <ArrowDownTrayIcon className="size-6" />
                  </Button>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
};

// Backwards compatibility - function wrapper
export const showImage = (destPath, imageKey, className = '') => {
  return (
    <ShowImage
      destPath={destPath}
      imageKey={imageKey}
      className={className}
      key={`${destPath}-${imageKey}`}
    />
  );
};

// Default export
export default ShowImage;

export const getImageURL = (destPath, imageKey) => {
  return `${apiConfig.baseURL.S3_URL}/${destPath}/${imageKey}`;
};
