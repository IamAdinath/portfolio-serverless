import React from 'react';
import './InitialsLogo.css';

interface InitialsLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  initials?: string;
}

const InitialsLogo: React.FC<InitialsLogoProps> = ({
  size = 'medium',
  className = '',
  initials = 'AG'
}) => {
  const sizeClasses = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-32 h-32 text-4xl',
    large: 'w-48 h-48 text-6xl'
  };

  const sizeStyles = {
    small: { width: '64px', height: '64px', fontSize: '18px' },
    medium: { width: '128px', height: '128px', fontSize: '36px' },
    large: { width: '192px', height: '192px', fontSize: '48px' }
  };

  return (
    <div
      className={`initials-logo ${sizeClasses[size]} ${className}`}
      style={{
        ...sizeStyles[size],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00E5FF 0%, #4D7CFF 100%)',
        color: '#000000',
        fontWeight: 'bold',
        fontFamily: "'Times New Roman', Times, serif",
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        border: '2px solid #00E5FF',
        borderRadius: '0', // Square for Tron theme
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.3)';
      }}
    >
      {/* Tron-style border animation */}
      <div
        style={{
          position: 'absolute',
          top: '-2px',
          left: '-100%',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #FFFFFF, transparent)',
          animation: 'borderGlow 3s linear infinite'
        }}
      />
      
      {/* Initials */}
      <span style={{ zIndex: 1, position: 'relative' }}>
        {initials}
      </span>
    </div>
  );
};

export default InitialsLogo;