/**
 * Bundle analyzer script to identify large dependencies
 * Run with: npm run analyze
 */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { execSync } = require('child_process');

// Build the app first
console.log('Building application for analysis...');
execSync('npm run build', { stdio: 'inherit' });

// Analyze the bundle
console.log('Analyzing bundle...');
const analyzer = new BundleAnalyzerPlugin({
  analyzerMode: 'server',
  openAnalyzer: true,
  generateStatsFile: true,
  statsFilename: 'bundle-stats.json',
});

// This would typically be integrated into webpack config
console.log('Bundle analysis complete. Check the generated report.');
console.log('Large dependencies to consider optimizing:');
console.log('- @fortawesome/* (use tree shaking)');
console.log('- @tiptap/* (lazy load editor)');
console.log('- highlight.js (load languages on demand)');
console.log('- aws-amplify (use specific imports)');
console.log('- framer-motion (lazy load animations)');
console.log('- evergreen-ui (lazy load components)');