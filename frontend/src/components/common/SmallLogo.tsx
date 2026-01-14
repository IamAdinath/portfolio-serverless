import React from 'react';

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
  
  const logoSize = size === 'small' ? '32px' : '40px';
  const fontSize = size === 'small' ? '14px' : '16px';

  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div 
        className={logoClass}
        style={{
          width: logoSize,
          height: logoSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00E5FF 0%, #4D7CFF 100%)',
          color: '#000000',
          fontWeight: 'bold',
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: fontSize,
          letterSpacing: '0.1em',
          border: '2px solid #00E5FF',
          borderRadius: '0',
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.3)';
        }}
      >
        AG
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