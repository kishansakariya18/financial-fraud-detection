import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import clsx from 'clsx';
const RenderImage = ({ id, preview, value, label = '' }) => {
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

  return (
    (preview || value !== '') && (
      <>
        <label htmlFor={'providerImage'} className={clsx('input-label')}>
          <span className={clsx('input-label')}>{label}</span>
        </label>
        <img
          id={id}
          src={preview ? preview : value}
          className={'img-thumbnail mb-2 mr-2 rounded'}
          style={{ maxWidth: '100px', maxHeight: '100px' }}
          alt={'null'}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <Skeleton
          height={100}
          width={100}
          baseColor="#e6eaeb"
          style={{ maxWidth: '100px', maxHeight: '100px' }}
        />
      </>
    )
  );
};
export default RenderImage;
