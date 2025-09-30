import { useState, useEffect } from 'react';

const ImagePreview = ({ src, alt }) => {
  const [open, setOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Thumbnail */}
      <img
        src={src}
        alt={alt || 'preview'}
        className="size-16 cursor-pointer rounded object-cover shadow-md hover:opacity-80"
        onClick={() => setOpen(true)}
      />

      {/* Modal */}
      {open && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
          {/* Close Button - top right of screen */}
          <button
            className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-lg font-bold shadow-md hover:bg-gray-200"
            onClick={() => setOpen(false)}>
            ✕
          </button>

          {/* Image container */}
          <div className="relative">
            <img
              src={src}
              alt={alt || 'full preview'}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
