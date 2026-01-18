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
  title = 'Adinath Gore - Python Developer & Cloud Engineer',
  description = 'Experienced Python Developer and Cloud Engineer specializing in Django, Flask, AWS, serverless architecture, and cloud solutions. View my portfolio, blog, and professional experience.',
  keywords = [
    'Adinath Gore',
    'Python Developer',
    'Cloud Engineer',
    'Django Developer',
    'Flask Developer',
    'AWS Developer',
    'Serverless Architecture',
    'Cloud Solutions',
    'Portfolio',
    'Blog'
  ],
  image = '/favicon.ico',
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
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Maharashtra, India" />
      <meta name="geo.position" content="19.0760;72.8777" />
      <meta name="ICBM" content="19.0760, 72.8777" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="classification" content="Portfolio, Software Development, Cloud Engineering" />
      <meta name="category" content="Technology, Software Development, Cloud Computing" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="7 days" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="pagename" content={fullTitle} />
      <meta name="subtitle" content="Professional Python Developer and Cloud Engineer Portfolio" />
      <meta name="abstract" content={description} />
      <meta name="topic" content="Software Development, Cloud Engineering, Python Programming" />
      <meta name="summary" content="Adinath Gore's professional portfolio showcasing Python development and cloud engineering expertise" />
      <meta name="designer" content="Adinath Gore" />
      <meta name="copyright" content="© 2024 Adinath Gore. All rights reserved." />
      <meta name="reply-to" content="contact@adinathgore.com" />
      <meta name="owner" content="Adinath Gore" />
      <meta name="url" content={fullUrl} />
      <meta name="identifier-URL" content={fullUrl} />
      <meta name="directory" content="submission" />
      <meta name="pagetype" content="Portfolio Website" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="format-detection" content="telephone=no" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Adinath Gore Portfolio" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Adinath Gore - Python Developer & Cloud Engineer" />
      <meta property="og:updated_time" content={modifiedTime || new Date().toISOString()} />
      
      {/* Additional Open Graph Tags */}
      <meta property="og:email" content="contact@adinathgore.com" />
      <meta property="og:phone_number" content="+91-9595xxxxxx" />
      <meta property="og:country-name" content="India" />
      <meta property="og:region" content="Maharashtra" />
      <meta property="og:postal-code" content="400001" />
      <meta property="og:locality" content="Mumbai" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@adinath_gore" />
      <meta name="twitter:site" content="@adinath_gore" />
      <meta name="twitter:image:alt" content="Adinath Gore - Python Developer & Cloud Engineer Portfolio" />
      <meta name="twitter:domain" content="adinathgore.com" />
      <meta name="twitter:url" content={fullUrl} />
      
      {/* Additional Twitter Tags */}
      <meta name="twitter:label1" content="Experience" />
      <meta name="twitter:data1" content="5+ Years" />
      <meta name="twitter:label2" content="Specialization" />
      <meta name="twitter:data2" content="Python & Cloud Engineering" />

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
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />
      <meta name="application-name" content="Adinath Gore Portfolio" />

      {/* Security Headers - Note: These should be set by server/CloudFront, not meta tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* HTTPS Enforcement */}
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

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
          "jobTitle": "Python Developer & Cloud Engineer",
          "description": description,
          "url": "https://adinathgore.com",
          "image": fullImage,
          "email": "mailto:contact@adinathgore.com",
          "telephone": "+91-9595xxxxxx",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN",
            "addressRegion": "Maharashtra"
          },
          "sameAs": [
            "https://www.linkedin.com/in/iamadinath/",
            "https://github.com/IamAdinath",
            "https://medium.com/@Iam_Adinath",
            "https://stackoverflow.com/users/14975561/adinath-gore"
          ],
          "knowsAbout": [
            "Python Programming",
            "Django Framework",
            "Flask Framework",
            "FastAPI",
            "AWS Cloud Services",
            "Cloud Engineering",
            "Serverless Architecture",
            "DevOps",
            "CI/CD",
            "Docker",
            "Kubernetes",
            "PostgreSQL",
            "MongoDB",
            "REST APIs",
            "GraphQL",
            "Cloud Solutions",
            "Infrastructure as Code",
            "Lambda Functions",
            "CloudFormation"
          ],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Software Engineer",
            "occupationLocation": {
              "@type": "Country",
              "name": "India"
            },
            "skills": [
              "Python Development",
              "Cloud Architecture",
              "AWS Services",
              "Backend Development",
              "API Development",
              "Database Design",
              "System Architecture"
            ]
          },
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Engineering College"
          },
          "worksFor": {
            "@type": "Organization",
            "name": "Rackspace Technology"
          },
          "award": [
            "Spot Award - Futops Technologies",
            "Employee of the Quarter - EC Infosolutions",
            "Star Performer - Algo.com"
          ],
          "certification": [
            "Artificial Intelligence and Business Strategy - LinkedIn Learning",
            "Data Science & Machine Learning - Udemy",
            "Python Certification - HackerRank",
            "SQL Certification - HackerRank"
          ]
        })}
      </script>

      {/* Website/Portfolio Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Adinath Gore Portfolio",
          "url": "https://adinathgore.com",
          "description": "Professional portfolio of Adinath Gore, Python Developer and Cloud Engineer",
          "author": {
            "@type": "Person",
            "name": "Adinath Gore"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://adinathgore.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Professional Service Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Adinath Gore - Python Development & Cloud Engineering Services",
          "description": "Professional Python development and cloud engineering services including AWS solutions, serverless architecture, and backend development",
          "url": "https://adinathgore.com",
          "serviceType": [
            "Python Development",
            "Cloud Engineering",
            "AWS Solutions",
            "Serverless Architecture",
            "Backend Development",
            "API Development",
            "Database Design",
            "DevOps Services"
          ],
          "provider": {
            "@type": "Person",
            "name": "Adinath Gore"
          },
          "areaServed": {
            "@type": "Country",
            "name": "India"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;