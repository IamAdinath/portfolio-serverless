import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Adinath Gore - Full Stack Developer & Software Engineer',
  description = 'Experienced Full Stack Developer specializing in React, Node.js, AWS, and modern web technologies. View my portfolio, blog, and professional experience.',
  keywords = [
    'Adinath Gore',
    'Full Stack Developer',
    'Software Engineer',
    'React Developer',
    'Node.js Developer',
    'AWS Developer',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Portfolio',
    'Blog'
  ],
  image = '/og-image.jpg',
  url = 'https://adinathgore.com',
  type = 'website',
  author = 'Adinath Gore',
  publishedTime,
  modifiedTime,
  section,
  tags
}) => {
  const fullTitle = title.includes('Adinath Gore') ? title : `${title} | Adinath Gore`;
  const fullUrl = url.startsWith('http') ? url : `https://adinathgore.com${url}`;
  const fullImage = image.startsWith('http') ? image : `https://adinathgore.com${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Adinath Gore Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@adinath_gore" />
      <meta name="twitter:site" content="@adinath_gore" />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />
      <meta name="application-name" content="Adinath Gore Portfolio" />

      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Adinath Gore",
          "jobTitle": "Full Stack Developer",
          "description": description,
          "url": "https://adinathgore.com",
          "image": fullImage,
          "sameAs": [
            "https://www.linkedin.com/in/iamadinath/",
            "https://github.com/adinath-gore",
            "https://medium.com/@Iam_Adinath",
            "https://stackoverflow.com/users/14975561/adinath-gore"
          ],
          "knowsAbout": [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "AWS",
            "Full Stack Development",
            "Software Engineering"
          ],
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Your University Name"
          },
          "worksFor": {
            "@type": "Organization",
            "name": "Your Company Name"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;