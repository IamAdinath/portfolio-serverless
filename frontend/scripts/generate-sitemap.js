#!/usr/bin/env node

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

async function generateSitemap() {
  const hostname = process.env.REACT_APP_SITE_URL || 'https://adinathgore.com';
  
  // Define your routes
  const routes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/resume', changefreq: 'monthly', priority: 0.9 },
    { url: '/blogs', changefreq: 'weekly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 }
  ];

  // Create a stream to write to
  const sitemap = new SitemapStream({ hostname });
  
  // Write sitemap to public directory
  const writeStream = createWriteStream(path.join(__dirname, '../public/sitemap.xml'));
  sitemap.pipe(writeStream);

  // Add each route to the sitemap
  routes.forEach(route => {
    sitemap.write({
      url: route.url,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: new Date().toISOString()
    });
  });

  // End the stream
  sitemap.end();

  // Wait for the stream to finish
  await streamToPromise(sitemap);
  
  console.log(`✅ Sitemap generated successfully at public/sitemap.xml for ${hostname}`);
}

generateSitemap().catch(console.error);