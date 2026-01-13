import React from 'react';
import { FILES } from '../../constants';
import profileImageAsset from '../../assets/profile-image.png';

interface ProfileImageProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
  priority?: boolean; // For LCP optimization
  loading?: 'lazy' | 'eager'; // Control loading behavior
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  size = 'medium',
  className = '',
  showFallback = true,
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

  // Handle image load error
  const handleImageError = () => {
    if (!showFallback) return;
    // Could implement fallback logic here if needed
  };

  return (
    <img
      src={profileImageAsset}
      alt={FILES.PROFILE_IMAGE_ALT}
      className={`${className} ${sizeClasses[size]} rounded-full object-cover`}
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
      onError={handleImageError}
    />
  );
};

export default ProfileImage;