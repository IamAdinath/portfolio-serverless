import React from 'react';
import logoAsset from '../../assets/logo.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  priority?: boolean; // For LCP optimization
  loading?: 'lazy' | 'eager'; // Control loading behavior
}

const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  className = '',
  priority = false,
  loading = 'eager'
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const sizePixels = {
    small: { width: 64, height: 64 },
    medium: { width: 128, height: 128 },
    large: { width: 192, height: 192 }
  };

  // For LCP optimization, ensure the image is rendered immediately
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    src: logoAsset,
    alt: "Adinath Gore - Logo",
    className: `${className} ${sizeClasses[size]} object-contain`,
    loading: loading,
    width: sizePixels[size].width,
    height: sizePixels[size].height,
    decoding: priority ? 'sync' : 'async',
    style: {
      // Ensure image takes space even while loading for LCP
      minWidth: sizePixels[size].width,
      minHeight: sizePixels[size].height,
    }
  };

  // Add fetchPriority for LCP images (TypeScript workaround)
  if (priority) {
    (imgProps as any).fetchPriority = 'high';
  }

  return (
    <img 
      {...imgProps}
      alt="Adinath Gore - Logo"
    />
  );
};

export default Logo;