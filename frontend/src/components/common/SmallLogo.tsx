import React from 'react';
import favicon32 from '../../assets/favicon-32x32.png';

interface SmallLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'small' | 'medium';
  variant?: 'header' | 'footer';
}

const SmallLogo: React.FC<SmallLogoProps> = ({
  className = '',
  showText = true,
  size = 'medium',
  variant = 'header'
}) => {
  const logoClass = variant === 'footer' ? 'footer-brand-logo' : 'brand-logo';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={logoClass}>
        <img
          src={favicon32}
          alt="Adinath Gore Logo"
          loading="eager"
        />
      </div>
      {showText && (
        <div className="logo-text">
          <span className="logo-name">Adinath Gore</span>
        </div>
      )}
    </div>
  );
};

export default SmallLogo;