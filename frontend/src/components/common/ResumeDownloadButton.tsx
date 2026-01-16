import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ResumeDownloadButton.css';
import { DownloadResume } from './apiService';
import { downloadFile } from '../../utils/downloadUtils';
import { useToast } from './ToastProvider';
import { trackDownload } from '../../utils/analytics';
import { APP_CONFIG, FILES } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const ResumeDownloadButton: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToast } = useToast();

  const handleDownload = async () => {
    try {
      setIsAnimating(true);
      addToast('info', 'Preparing download...');

      const response = await DownloadResume();
      const presignedUrl = response.downloadUrl;
      const filename = response.filename || FILES.RESUME_FILENAME;

      setTimeout(async () => {
        if (presignedUrl) {
          try {
            await downloadFile(presignedUrl, filename);
            addToast('success', 'Resume downloaded successfully!');
            
            // Track download event
            trackDownload(filename, 'pdf');
          } catch (error) {
            console.error('Error downloading file:', error);
            addToast('error', 'Failed to download file. Please try again.');
          }
        }

        setIsAnimating(false);
      }, APP_CONFIG.ANIMATION_DURATION);

    } catch (err) {
      console.error('Failed to fetch resume URL:', err);
      addToast('error', 'Error getting download link. Please try again.');
      setIsAnimating(false);
    }
  };

  const buttonContent = (
    <button
      onClick={handleDownload}
      className="floating-download-btn"
      disabled={isAnimating}
      aria-label="Download Resume"
    >
      {isAnimating ? (
        <>
          <FontAwesomeIcon icon={faDownload} spin /> Downloading...
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faDownload} /> Download Resume
        </>
      )}
    </button>
  );

  // Render directly to body using portal to avoid stacking context issues
  return createPortal(buttonContent, document.body);
};

export default ResumeDownloadButton;
