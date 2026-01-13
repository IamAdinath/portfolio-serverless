/**
 * Optimized syntax highlighting with lazy loading
 * Only loads languages when needed
 */

import { createLowlight } from 'lowlight';

// Create lowlight instance
const lowlight = createLowlight();

// Language loaders - only load when needed
const languageLoaders = {
  javascript: () => import('highlight.js/lib/languages/javascript'),
  typescript: () => import('highlight.js/lib/languages/typescript'),
  css: () => import('highlight.js/lib/languages/css'),
  json: () => import('highlight.js/lib/languages/json'),
  html: () => import('highlight.js/lib/languages/xml'),
  python: () => import('highlight.js/lib/languages/python'),
  bash: () => import('highlight.js/lib/languages/bash'),
  sql: () => import('highlight.js/lib/languages/sql'),
};

type SupportedLanguage = keyof typeof languageLoaders;

// Cache for loaded languages
const loadedLanguages = new Set<string>();

/**
 * Lazy load a syntax highlighting language
 */
export const loadLanguage = async (language: SupportedLanguage): Promise<void> => {
  if (loadedLanguages.has(language)) {
    return; // Already loaded
  }

  try {
    const languageModule = await languageLoaders[language]();
    lowlight.register(language, languageModule.default);
    loadedLanguages.add(language);
  } catch (error) {
    console.warn(`Failed to load syntax highlighting for ${language}:`, error);
  }
};

/**
 * Get lowlight instance with essential languages pre-loaded
 */
export const getLowlight = async (): Promise<typeof lowlight> => {
  // Pre-load most common languages
  await Promise.all([
    loadLanguage('javascript'),
    loadLanguage('typescript'),
    loadLanguage('css'),
    loadLanguage('json'),
  ]);

  return lowlight;
};

/**
 * Highlight code with automatic language detection and loading
 */
export const highlightCode = async (code: string, language?: SupportedLanguage): Promise<string> => {
  if (language && !loadedLanguages.has(language)) {
    await loadLanguage(language);
  }

  try {
    const result = language 
      ? lowlight.highlight(language, code)
      : lowlight.highlightAuto(code);
    
    return result.value;
  } catch (error) {
    console.warn('Syntax highlighting failed:', error);
    return code; // Return plain code as fallback
  }
};