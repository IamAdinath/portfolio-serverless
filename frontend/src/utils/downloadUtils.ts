/**
 * Utility functions for handling file downloads
 */

/**
 * Downloads a file from a URL by fetching it as a blob and triggering a download
 * This ensures the file is downloaded rather than opened in a new tab
 * 
 * @param url - The URL to download from
 * @param filename - The filename to save as
 * @param onProgress - Optional progress callback
 */
export async function downloadFileFromUrl(
  url: string, 
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];

    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;
      
      if (onProgress && total > 0) {
        onProgress((loaded / total) * 100);
      }
    }

    // Combine chunks into a single blob
    const blob = new Blob(chunks);
    
    // Create download link
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}

/**
 * Simple download function without progress tracking
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  return downloadFileFromUrl(url, filename);
}