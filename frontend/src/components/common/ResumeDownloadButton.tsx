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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Create a portal container at the body level to avoid any CSS containment issues
    const container = document.createElement('div');
    container.id = 'floating-button-portal';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10000';
    
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

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
      style={{ pointerEvents: 'auto' }}
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

  // Render using portal to avoid CSS containment issues
  return portalContainer ? createPortal(buttonContent, portalContainer) : buttonContent;
};

export default ResumeDownloadButton;
