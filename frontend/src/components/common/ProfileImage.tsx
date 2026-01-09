import React, { useState, useEffect } from 'react';
import { GetProfileImage } from './userAPI';
import { FILES } from '../../constants';

interface ProfileImageProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  size = 'medium',
  className = '',
  showFallback = true
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        setLoading(true);
        const url = await GetProfileImage();
        setImageUrl(url);
        setError(false);
      } catch (err) {
        console.error('Failed to load profile image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [showFallback]);

  const handleImageError = () => {
    if (showFallback && !error) {
      setError(true);
    }
  };

  if (loading) {
    return (
      <div className={`${className} ${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center`}>
        <span className="text-gray-500 text-xs">Loading...</span>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} ${sizeClasses[size]} bg-gradient-to-br from-gray-100 to-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400`}>
        <span className="text-gray-700 font-bold text-2xl">AG</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={FILES.PROFILE_IMAGE_ALT}
      className={`${className} ${sizeClasses[size]} rounded-full object-cover`}
      onError={handleImageError}
    />
  );
};

export default ProfileImage;