import React, { useState } from 'react';
import './stickManDownload.css';
import { DownloadResume } from './userAPI';
import { downloadFile } from '../../utils/downloadUtils';
import { useToast } from './ToastProvider';
import { trackDownload } from '../../utils/analytics';
import { APP_CONFIG, FILES } from '../../constants';

const StickmanDownload: React.FC = () => {
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
