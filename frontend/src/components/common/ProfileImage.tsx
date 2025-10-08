import React, { useState, useEffect } from 'react';
import { GetProfileImage } from './userAPI';

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
        // Fallback to placeholder
        if (showFallback) {
          setImageUrl("https://via.placeholder.com/400x400/f7fafc/2d2d2d?text=AG");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [showFallback]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (showFallback && !error) {
      const target = e.target as HTMLImageElement;
      target.src = "https://via.placeholder.com/400x400/f7fafc/2d2d2d?text=AG";
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

  return (
    <img
      src={imageUrl}
      alt="Adinath Gore - Software Engineer"
      className={`${className} ${sizeClasses[size]}`}
      onError={handleImageError}
    />
  );
};

export default ProfileImage;