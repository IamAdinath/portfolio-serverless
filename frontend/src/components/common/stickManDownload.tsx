import './stickManDownload.css'
// StickmanDownload.tsx
import { DownloadResume } from './userAPI';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './stickManDownload.css';

const StickmanDownload: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStickman, setShowStickman] = useState(false);

  const handleDownload = async () => {
    try {
      setIsAnimating(true);
      setShowStickman(true);

      const response = await DownloadResume();
      const presignedUrl = response.url;

      setTimeout(() => {
        if (presignedUrl) {
          const link = document.createElement('a');
          link.href = presignedUrl;
          link.download = 'Adinath_Gore_Resume.pdf';
          link.click();
        }
        setIsAnimating(false);
        setShowStickman(false);
      }, 3200); // Sync with animation
    } catch (err) {
      console.error('Failed to fetch resume URL:', err);
      setIsAnimating(false);
      setShowStickman(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="floating-download-btn"
        disabled={isAnimating}
      >
        {isAnimating ? 'Downloading...' : '📥 Download'}
      </button>

      {showStickman && (
        <motion.div
          className="stickman-wrapper"
          initial={{ x: '-100%' }}
          animate={{ x: '60%' }}
          transition={{ duration: 3 }}
        >
          <div className="stickman">🤵‍♂️</div>
          <div className="rope" />
          <motion.div
            className="file-icon"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            📄
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default StickmanDownload;
