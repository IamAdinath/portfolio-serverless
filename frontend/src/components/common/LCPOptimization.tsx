import React from 'react';
import { Helmet } from 'react-helmet-async';
import logoAsset from '../../assets/Logo_old.png';

/**
 * LCP Optimization Component
 * Adds preload link for the LCP image to make it discoverable from HTML immediately
 */
const LCPOptimization: React.FC = () => {
  return (
    <Helmet>
      <link 
        rel="preload" 
        as="image" 
        href={logoAsset} 
        fetchPriority="high"
      />
    </Helmet>
  );
};

export default LCPOptimization;