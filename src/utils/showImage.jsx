import apiConfig from 'configs/api.config';
import { Link } from 'react-router';

export const showImage = (
  destPath,
  key,
  // maxWidth = '250px',
  // maxHeight = '75px',
  // width = '',
  className = ''
) => {
  return (
    <Link to={`${apiConfig.baseURL.S3_URL}/${destPath}/${key}`} target="__blank">
      <img
        src={`${apiConfig.baseURL.S3_URL}/${destPath}/${key}`}
        alt={'invalid image'}
        className={className}
        // style={{ maxWidth: maxWidth, maxHeight: maxHeight, width: width }}
      />
    </Link>
  );
};
