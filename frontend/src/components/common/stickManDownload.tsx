import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './stickManDownload.css';
import { ResumeLink, GetFile } from './userAPI';

const StickmanDownload: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStickman, setShowStickman] = useState(false);

  const handleDownload = async () => {
    try {
      setIsAnimating(true);
      setShowStickman(true);

      const response = await ResumeLink();
      const presignedUrl = response.url;

      setTimeout(async () => {
        if (presignedUrl) {
          try {
            const fileResponse = await GetFile(presignedUrl);
            if (!fileResponse) throw new Error('Failed to fetch file');

            // const blob = await fileResponse();
            const blobUrl = window.URL.createObjectURL(fileResponse);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Adinath_Gore_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(blobUrl);
          } catch (error) {
            console.error('Error downloading file blob:', error);
            alert('Failed to download file. Please try again.');
          }
        }

        setIsAnimating(false);
        setShowStickman(false);
      }, 3200); // Sync with animation

    } catch (err) {
      console.error('Failed to fetch resume URL:', err);
      alert('Error getting download link.');
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
