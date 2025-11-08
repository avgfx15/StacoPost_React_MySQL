import React from 'react';

// | Imagekit.io for Images from cloud
import { Image } from '@imagekit/react';

// & Image Component

const ImageComponent = ({ src, alt, className, width, height }) => {
  // ^ Render ImageComponent
  if (!src) {
    // Return a default avatar if no src is provided
    return (
      <img
        src='https://cdn-icons-png.flaticon.com/512/219/219983.png'
        alt={alt || 'Default avatar'}
        className={className}
        width={width}
        height={height}
        loading='lazy'
      />
    );
  }

  // Check if it's a Google profile image URL (starts with https://lh3.googleusercontent.com)
  if (src.startsWith('https://lh3.googleusercontent.com')) {
    // Use regular img tag for Google profile images
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading='lazy'
        onError={(e) => {
          // Fallback to default avatar if Google image fails to load
          e.target.src =
            'https://cdn-icons-png.flaticon.com/512/219/219983.png';
        }}
      />
    );
  }

  // Use ImageKit for other images
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading='lazy'
      lqio={{ active: true, quality: 20 }}
      transformation={[
        {
          width: width,
          height: height,
        },
      ]}
    />
  );
};

// ~ Image Component Export
export default ImageComponent;
