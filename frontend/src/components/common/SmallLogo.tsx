import React from 'react';
import favicon32 from '../../assets/favicon-32x32.png';

interface SmallLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'small' | 'medium';
}

const SmallLogo: React.FC<SmallLogoProps> = ({
  className = '',
  showText = true,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6', // 24px
    medium: 'w-8 h-8' // 32px
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={favicon32}
        alt="Adinath Gore Logo"
        className={`${sizeClasses[size]} object-contain`}
        width={size === 'small' ? 24 : 32}
        height={size === 'small' ? 24 : 32}
        loading="eager"
      />
      {showText && (
        <div className="logo-text">
          <span className="logo-name">Adinath Gore</span>
        </div>
      )}
    </div>
  );
};

export default SmallLogo;