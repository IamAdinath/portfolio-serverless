#!/usr/bin/env node

/**
 * Inline Critical CSS Script
 * Inlines critical above-the-fold CSS into the HTML head
 * and defers non-critical CSS loading
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '../build');
const criticalCssPath = path.join(__dirname, '../src/styles/critical.css');
const indexHtmlPath = path.join(buildDir, 'index.html');

function inlineCriticalCSS() {
  try {
    // Check if build directory exists
    if (!fs.existsSync(buildDir)) {
      console.log('⚠️  Build directory not found. Run npm run build first.');
      return;
    }

    // Read critical CSS
    if (!fs.existsSync(criticalCssPath)) {
      console.log('⚠️  Critical CSS file not found.');
      return;
    }

    const criticalCSS = fs.readFileSync(criticalCssPath, 'utf8');
    
    // Read index.html
    let html = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Minify critical CSS (basic minification)
    const minifiedCSS = criticalCSS
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around punctuation
      .trim();
    
    // Create inline style tag
    const inlineStyle = `<style>${minifiedCSS}</style>`;
    
    // Insert critical CSS before closing </head>
    html = html.replace('</head>', `${inlineStyle}\n</head>`);
    
    // Find all CSS link tags and make them non-blocking
    html = html.replace(
      /<link([^>]*?)href="([^"]*\.css)"([^>]*?)>/g,
      (match, before, href, after) => {
        // Skip if already has rel="preload"
        if (match.includes('rel="preload"')) {
          return match;
        }
        
        // Make CSS non-blocking with preload
        return `<link${before}rel="preload"${after} href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link${before}rel="stylesheet"${after} href="${href}"></noscript>`;
      }
    );
    
    // Add loadCSS polyfill for older browsers
    const loadCSSPolyfill = `<script>
/*! loadCSS. [c]2017 Filament Group, Inc. MIT License */
!function(e){"use strict";var t=function(t,n,r,o){var i,a=e.document,d=a.createElement("link");if(n)i=n;else{var l=(a.body||a.getElementsByTagName("head")[0]).childNodes;i=l[l.length-1]}var s=a.styleSheets;if(o)for(var f in o)o.hasOwnProperty(f)&&d.setAttribute(f,o[f]);d.rel="stylesheet",d.href=t,d.media="only x",function e(t){if(a.body)return t();setTimeout(function(){e(t)})}(function(){i.parentNode.insertBefore(d,n?i:i.nextSibling)});var u=function(e){for(var t=d.href,n=s.length;n--;)if(s[n].href===t)return e();setTimeout(function(){u(e)})};return d.addEventListener&&d.addEventListener("load",function(){this.media=r||"all"}),d.onloadcssdefined=u,u(function(){d.media!==r&&(d.media=r)}),d};"undefined"!=typeof exports?exports.loadCSS=t:e.loadCSS=t}("undefined"!=typeof global?global:this);
</script>`;
    
    html = html.replace('</head>', `${loadCSSPolyfill}\n</head>`);
    
    // Write optimized HTML
    fs.writeFileSync(indexHtmlPath, html);
    
    console.log('✅ Critical CSS inlined successfully!');
    console.log(`   - Inlined ${minifiedCSS.length} bytes of critical CSS`);
    console.log('   - Made non-critical CSS non-blocking');
    console.log('   - Added loadCSS polyfill for browser compatibility');
    
  } catch (error) {
    console.error('❌ Error inlining critical CSS:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  inlineCriticalCSS();
}

module.exports = { inlineCriticalCSS };