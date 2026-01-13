/**
 * API Debugging utility to help diagnose backend issues
 */

interface ApiDebugInfo {
  apiBaseUrl: string | undefined;
  currentUrl: string;
  userAgent: string;
  timestamp: string;
  environment: string;
}

/**
 * Get comprehensive API debugging information
 */
export const getApiDebugInfo = (): ApiDebugInfo => {
  return {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    currentUrl: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  };
};

/**
 * Test API connectivity
 */
export const testApiConnectivity = async (): Promise<{
  success: boolean;
  error?: string;
  status?: number;
  response?: any;
}> => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    return {
      success: false,
      error: 'API_BASE_URL is not defined'
    };
  }

  try {
    // Test a simple endpoint
    const testUrl = `${apiBaseUrl}/get-blogs`;
    console.log('Testing API connectivity to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    
    return {
      success: response.ok,
      status: response.status,
      response: responseText,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test profile image API specifically
 */
export const testProfileImageApi = async (): Promise<{
  success: boolean;
  error?: string;
  status?: number;
  response?: any;
}> => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  if (!apiBaseUrl) {
    return {
      success: false,
      error: 'API_BASE_URL is not defined'
    };
  }

  try {
    const testUrl = `${apiBaseUrl}/get-media?type=profile`;
    console.log('Testing profile image API:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await response.text();
    
    return {
      success: response.ok,
      status: response.status,
      response: responseText,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Log comprehensive debugging information
 */
export const logApiDebugInfo = async (): Promise<void> => {
  console.group('🔍 API Debug Information');
  
  const debugInfo = getApiDebugInfo();
  console.log('Environment Info:', debugInfo);
  
  console.log('Testing API connectivity...');
  const connectivityTest = await testApiConnectivity();
  console.log('API Connectivity Test:', connectivityTest);
  
  console.log('Testing Profile Image API...');
  const profileTest = await testProfileImageApi();
  console.log('Profile Image API Test:', profileTest);
  
  console.groupEnd();
};

/**
 * Initialize debugging in development
 */
export const initializeApiDebugging = (): void => {
  if (process.env.NODE_ENV === 'development') {
    // Add debug info to window for easy access
    (window as any).apiDebug = {
      getInfo: getApiDebugInfo,
      testConnectivity: testApiConnectivity,
      testProfileImage: testProfileImageApi,
      logAll: logApiDebugInfo
    };
    
    console.log('🔧 API debugging tools available at window.apiDebug');
    console.log('Run window.apiDebug.logAll() to see full debug info');
  }
};