import React, { useState } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = ({ src, webpSrc, alt, className, width, height, lazy = true }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <picture className={`${className} ${!loaded ? 'bg-gray-700 animate-pulse' : ''}`}>
      {webpSrc && (
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
          onLoad={() => setLoaded(true)}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  webpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  lazy: PropTypes.bool
};

export default OptimizedImage;