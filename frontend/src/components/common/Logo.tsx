import React from 'react';
import logoAsset from '../../assets/Logo_old.png';

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

  return (
    <img
      src={logoAsset}
      alt="Adinath Gore - Logo"
      className={`${className} ${sizeClasses[size]} object-contain`}
      loading={loading}
      {...(priority && { fetchPriority: 'high' as any })}
      width={sizePixels[size].width}
      height={sizePixels[size].height}
      decoding={priority ? 'sync' : 'async'}
      style={{
        // Ensure image takes space even while loading for LCP
        minWidth: sizePixels[size].width,
        minHeight: sizePixels[size].height,
      }}
    />
  );
};

export default Logo;