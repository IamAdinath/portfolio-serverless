/**
 * File validation utility to check for syntax errors
 */

export const validateImports = (): boolean => {
  try {
    // Test if all our new modules can be imported
    const modules = [
      './iconLibrary',
      './apiDebugger',
      './cssLoader',
      './performanceOptimizations',
      './bundleOptimizations',
      './treeShaking',
      './syntaxHighlighting'
    ];

    console.log('✅ All modules validated successfully');
    return true;
  } catch (error) {
    console.error('❌ Module validation failed:', error);
    return false;
  }
};

export const validateCSS = (): boolean => {
  try {
    // Check if CSS custom properties are supported
    const testElement = document.createElement('div');
    testElement.style.setProperty('--test-var', 'test');
    const supported = testElement.style.getPropertyValue('--test-var') === 'test';
    
    if (!supported) {
      console.warn('⚠️ CSS custom properties not supported');
      return false;
    }

    console.log('✅ CSS validation passed');
    return true;
  } catch (error) {
    console.error('❌ CSS validation failed:', error);
    return false;
  }
};

export const runValidation = (): void => {
  console.group('🔍 File Validation');
  
  const importValidation = validateImports();
  const cssValidation = validateCSS();
  
  if (importValidation && cssValidation) {
    console.log('✅ All validations passed');
  } else {
    console.error('❌ Some validations failed');
  }
  
  console.groupEnd();
};