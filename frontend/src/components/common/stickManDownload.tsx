import React, { useState } from 'react';
import './stickManDownload.css';
import { ResumeLink, GetFile } from './userAPI';

const StickmanDownload: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleDownload = async () => {
    try {
      setIsAnimating(true);

      const presignedUrl = await ResumeLink();

      setTimeout(async () => {
        if (presignedUrl) {
          try {
            // Create a direct download link using the presigned URL
            const link = document.createElement('a');
            link.href = presignedUrl;
            link.download = 'Adinath_Gore_Resume.pdf';
            link.target = '_blank'; // Open in new tab as fallback
            document.body.appendChild(link);
            link.click();
            link.remove();
          } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
          }
        }

        setIsAnimating(false);      }, 3200); // Sync with animation

    } catch (err) {
      console.error('Failed to fetch resume URL:', err);
      alert('Error getting download link.');
      setIsAnimating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="floating-download-btn"
        disabled={isAnimating}
      >
        {isAnimating ? '⏳ Downloading...' : '📄 Download Resume'}
      </button>

    </>
  );
};

export default StickmanDownload;
