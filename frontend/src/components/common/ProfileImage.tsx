import React from 'react';
import { FILES } from '../../constants';
import { useProfileImagePreload } from '../../hooks/useProfileImagePreload';

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
  const { imageUrl, isLoading, error } = useProfileImagePreload();

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

  // Optimized fallback with better styling
  const FallbackComponent = () => (
    <div className={`${className} ${sizeClasses[size]} bg-gradient-to-br from-gray-100 to-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400`}>
      <span className="text-gray-700 font-bold text-2xl">AG</span>
    </div>
  );

  // Show fallback immediately if there's an error or no fallback requested
  if (error && !showFallback) {
    return null;
  }

  if (error || (!imageUrl && !isLoading)) {
    return <FallbackComponent />;
  }

  // Show fallback while loading for non-priority images
  if (isLoading && !priority) {
    return <FallbackComponent />;
  }

  // For priority images, render immediately with proper attributes
  return (
    <img
      src={imageUrl || ''}
      alt={FILES.PROFILE_IMAGE_ALT}
      className={`${className} ${sizeClasses[size]} rounded-full object-cover`}
      loading={loading}
      fetchPriority={priority ? 'high' : 'auto'}
      width={sizePixels[size].width}
      height={sizePixels[size].height}
      decoding={priority ? 'sync' : 'async'}
      style={{
        // Ensure image takes space even while loading for LCP
        minWidth: sizePixels[size].width,
        minHeight: sizePixels[size].height,
      }}
      onError={() => {
        // Fallback handled by hook state
      }}
    />
  );
};

export default ProfileImage;