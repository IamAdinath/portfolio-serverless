import React, { useEffect } from 'react';
import './ProfileImageCard.css';
import InitialsProfile from './InitialsProfile';
import { getProfileImage } from './apiService';

interface ProfileImageCardProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ProfileImageCard: React.FC<ProfileImageCardProps> = ({ 
  size = 'medium',
  className = ''
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { imageUrl } = await getProfileImage();
        if (containerRef.current && imageUrl) {
          containerRef.current.style.setProperty('--profile-image-url', `url(${imageUrl})`);
        }
      } catch (error) {
        console.error('Failed to load profile image:', error);
      }
    };
    fetchProfileImage();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`profile-image-card profile-image-card-${size} ${className}`}
    >
      <InitialsProfile 
        className="profile-image-card-initials"
        size={size}
        initials="AG"
      />
    </div>
  );
};

export default ProfileImageCard;
