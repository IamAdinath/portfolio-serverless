import React from 'react';

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
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32', 
    large: 'w-48 h-48'
  };

  // Adinath's LinkedIn profile picture
  const profileImageUrl = "https://media.licdn.com/dms/image/v2/D4D03AQEnfQc0ihZNJw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1703858333994?e=1762387200&v=beta&t=T2i9BvRabZqceqYKNadrTyP6VxoSSojrvezqw-ojCRs";
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (showFallback) {
      const target = e.target as HTMLImageElement;
      target.src = "https://via.placeholder.com/400x400/f7fafc/2d2d2d?text=AG";
    }
  };

  return (
    <img
      src={profileImageUrl}
      alt="Adinath Gore - Software Engineer"
      className={`${className} ${sizeClasses[size]}`}
      onError={handleImageError}
    />
  );
};

export default ProfileImage;