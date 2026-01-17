import React from 'react';
import './InitialsLogo.css';

interface InitialsProfileProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  initials?: string;
}

const InitialsProfile: React.FC<InitialsProfileProps> = ({
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
    large: { width: '250px', height: '250px', fontSize: '72px' } // Larger for profile
  };

  return (
    <div
      className={`initials-profile ${sizeClasses[size]} ${className}`}
      style={{
        ...sizeStyles[size],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #000000 0%, #001122 50%, #000000 100%)',
        color: '#00E5FF',
        fontWeight: 'bold',
        fontFamily: "'Times New Roman', Times, serif",
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        border: '3px solid #00E5FF',
        borderRadius: '0',
        boxShadow: '0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 25px rgba(0, 229, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 229, 255, 0.6), inset 0 0 40px rgba(0, 229, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 25px rgba(0, 229, 255, 0.1)';
      }}
    >
      {/* Tron-style corner accents */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          border: '2px solid #00E5FF',
          borderRight: 'none',
          borderBottom: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          border: '2px solid #00E5FF',
          borderLeft: 'none',
          borderBottom: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '20px',
          height: '20px',
          border: '2px solid #00E5FF',
          borderRight: 'none',
          borderTop: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '20px',
          height: '20px',
          border: '2px solid #00E5FF',
          borderLeft: 'none',
          borderTop: 'none'
        }}
      />
      
      {/* Scanning line animation */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
          animation: 'scanLine 4s linear infinite'
        }}
      />
      
      {/* Initials */}
      <span style={{ 
        zIndex: 1, 
        position: 'relative',
        textShadow: '0 0 10px rgba(0, 229, 255, 0.8)'
      }}>
        {initials}
      </span>
    </div>
  );
};

export default InitialsProfile;