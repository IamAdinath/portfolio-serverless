#!/usr/bin/env node

/**
 * Local SEO Testing Script
 * Run this script to validate SEO implementation locally
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Local SEO Validation...\n');

const buildDir = path.join(__dirname, '../build');
const errors = [];
const warnings = [];

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// 1. Check for essential SEO files
console.log('📁 Checking essential SEO files...');

const essentialFiles = [
  'index.html',
  'sitemap.xml',
  'robots.txt',
  'manifest.json'
];

essentialFiles.forEach(file => {
  const filePath = path.join(buildDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    errors.push(`${file} is missing`);
    console.log(`❌ ${file} is missing`);
  }
});

// 2. Validate HTML structure
console.log('\n🏗️ Validating HTML structure...');

const indexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for title tag (either static or React Helmet placeholder)
  if (htmlContent.includes('<title>') || htmlContent.includes('react-helmet-async')) {
    console.log('✅ Title tag found or React Helmet configured');
  } else {
    errors.push('Title tag missing and React Helmet not configured');
    console.log('❌ Title tag missing and React Helmet not configured');
  }
  
  // Check for meta description
  if (htmlContent.includes('name="description"')) {
    console.log('✅ Meta description found');
  } else {
    errors.push('Meta description missing');
    console.log('❌ Meta description missing');
  }
  
  // Check for Open Graph tags
  if (htmlContent.includes('property="og:')) {
    console.log('✅ Open Graph tags found');
  } else {
    warnings.push('Open Graph tags missing');
    console.log('⚠️ Open Graph tags missing');
  }
  
  // Check for Twitter Card tags
  if (htmlContent.includes('name="twitter:')) {
    console.log('✅ Twitter Card tags found');
  } else {
    warnings.push('Twitter Card tags missing');
    console.log('⚠️ Twitter Card tags missing');
  }
  
  // Check for canonical URL
  if (htmlContent.includes('rel="canonical"')) {
    console.log('✅ Canonical URL found');
  } else {
    warnings.push('Canonical URL missing');
    console.log('⚠️ Canonical URL missing');
  }
  
  // Check for security headers
  if (htmlContent.includes('X-Content-Type-Options')) {
    console.log('✅ Security headers found');
  } else {
    warnings.push('Security headers missing');
    console.log('⚠️ Security headers missing');
  }
}

// 3. Validate sitemap
console.log('\n🗺️ Validating sitemap...');

const sitemapPath = path.join(buildDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  try {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    
    // Basic XML validation
    if (sitemapContent.includes('<?xml') && sitemapContent.includes('<urlset')) {
      console.log('✅ Sitemap XML structure is valid');
    } else {
      errors.push('Sitemap XML structure is invalid');
      console.log('❌ Sitemap XML structure is invalid');
    }
    
    // Check for URLs
    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    if (urlCount > 0) {
      console.log(`✅ Sitemap contains ${urlCount} URLs`);
    } else {
      warnings.push('Sitemap contains no URLs');
      console.log('⚠️ Sitemap contains no URLs');
    }
    
  } catch (error) {
    errors.push('Failed to read sitemap');
    console.log('❌ Failed to read sitemap');
  }
}

// 4. Validate robots.txt
console.log('\n🤖 Validating robots.txt...');

const robotsPath = path.join(buildDir, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  try {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    
    if (robotsContent.includes('User-agent:')) {
      console.log('✅ Robots.txt has User-agent directive');
    } else {
      warnings.push('Robots.txt missing User-agent directive');
      console.log('⚠️ Robots.txt missing User-agent directive');
    }
    
    if (robotsContent.includes('Sitemap:')) {
      console.log('✅ Robots.txt has Sitemap directive');
    } else {
      warnings.push('Robots.txt missing Sitemap directive');
      console.log('⚠️ Robots.txt missing Sitemap directive');
    }
    
  } catch (error) {
    errors.push('Failed to read robots.txt');
    console.log('❌ Failed to read robots.txt');
  }
}

// 5. Check for compressed assets
console.log('\n📦 Checking asset compression...');

const staticDir = path.join(buildDir, 'static');
if (fs.existsSync(staticDir)) {
  const jsDir = path.join(staticDir, 'js');
  const cssDir = path.join(staticDir, 'css');
  
  // Check for compressed JS files (gzip and brotli)
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir);
    const gzippedJs = jsFiles.filter(file => file.endsWith('.gz'));
    const brotliJs = jsFiles.filter(file => file.endsWith('.br'));
    
    if (gzippedJs.length > 0 || brotliJs.length > 0) {
      console.log(`✅ Found ${gzippedJs.length} gzipped and ${brotliJs.length} brotli compressed JS files`);
    } else {
      warnings.push('No compressed JS files found');
      console.log('⚠️ No compressed JS files found');
    }
  }
  
  // Check for compressed CSS files (gzip and brotli)
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    const gzippedCss = cssFiles.filter(file => file.endsWith('.gz'));
    const brotliCss = cssFiles.filter(file => file.endsWith('.br'));
    
    if (gzippedCss.length > 0 || brotliCss.length > 0) {
      console.log(`✅ Found ${gzippedCss.length} gzipped and ${brotliCss.length} brotli compressed CSS files`);
    } else {
      warnings.push('No compressed CSS files found');
      console.log('⚠️ No compressed CSS files found');
    }
  }
  
  // Check for compressed HTML files
  const htmlFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.html'));
  const gzippedHtml = fs.readdirSync(buildDir).filter(file => file.endsWith('.html.gz'));
  const brotliHtml = fs.readdirSync(buildDir).filter(file => file.endsWith('.html.br'));
  
  if (gzippedHtml.length > 0 || brotliHtml.length > 0) {
    console.log(`✅ Found ${gzippedHtml.length} gzipped and ${brotliHtml.length} brotli compressed HTML files`);
  } else {
    warnings.push('No compressed HTML files found');
    console.log('⚠️ No compressed HTML files found');
  }
}

// 6. Validate manifest.json
console.log('\n📱 Validating web manifest...');

const manifestPath = path.join(buildDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ Web manifest has all required fields');
    } else {
      warnings.push(`Web manifest missing fields: ${missingFields.join(', ')}`);
      console.log(`⚠️ Web manifest missing fields: ${missingFields.join(', ')}`);
    }
    
  } catch (error) {
    errors.push('Failed to parse manifest.json');
    console.log('❌ Failed to parse manifest.json');
  }
}

// 7. Summary
console.log('\n📊 SEO Validation Summary');
console.log('========================');

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 All SEO validations passed! Your site is ready for deployment.');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} Error(s):`);
    errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️ ${warnings.length} Warning(s):`);
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n🚨 Please fix the errors before deploying to production.');
    process.exit(1);
  } else {
    console.log('\n✅ No critical errors found. Warnings should be addressed when possible.');
  }
}

console.log('\n🔗 Useful commands:');
console.log('   npm run build          - Build the project');
console.log('   npm run seo:test        - Run this SEO validation');
console.log('   npm run lighthouse      - Run Lighthouse audit');
console.log('   npm run serve           - Serve build locally');

console.log('\n📚 SEO Resources:');
console.log('   • Google Search Console: https://search.google.com/search-console');
console.log('   • PageSpeed Insights: https://pagespeed.web.dev/');
console.log('   • Lighthouse: https://developers.google.com/web/tools/lighthouse');
console.log('   • SEO Guide: ./SEO-IMPLEMENTATION.md');