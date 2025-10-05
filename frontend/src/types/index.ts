// src/types/index.ts
// Centralized TypeScript type definitions for the frontend application
//
// This file contains all shared TypeScript interfaces and types used across
// the frontend application. Import specific types as needed:
//
// Example: import { Toast, BlogPostData, ApiError } from '../../types';
//
// Organized by category:
// - Toast system types
// - API-related types  
// - Blog/content types
// - S3 upload types
// - Component prop types
// - Utility types

// ===== TOAST TYPES =====
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type ToastContextType = {
  addToast: (type: Toast['type'], message: string, duration?: number) => void;
};

export interface ToastMessageProps {
  toast: Toast;
  onDismiss: () => void;
}

// ===== API TYPES =====
export interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export interface ConfirmUserPayload {
  username: string;
}

export interface ConfirmUserResponse {
  success: boolean;
  message: string;
}

// ===== BLOG TYPES =====
export interface BlogPostData {
  id: string;
  title: string;
  content: string;
  reading_time: number;
  status: string;
  images: string[];
  tags: string[];
  updated_at: string;
  created_at: string;
  published_at?: string;
  author: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  published_at?: string;
  images?: string;
  tags?: string[];
  [key: string]: any;
}

export interface BlogPostPayload {
  title: string;
  content: string;
  images?: string[];
  status?: string;
}

// ===== S3 UPLOAD TYPES =====
export interface PresignedUrlResponse {
  publicUrl: string;
  fields?: Record<string, string>;
}

export interface PresignedUrlApiResponse {
  presignedUrl: string;
  publicUrl: string;
  fileName: string;
}

// ===== COMPONENT PROP TYPES =====
export interface SuggestedBlog {
  id: number;
  title: string;
  author: string;
  thumbnail: string; // URL to the thumbnail image
}

export interface SuggestedBlogsProps {
  suggestions: SuggestedBlog[];
}

export interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  readTimeInMinutes: number;
  thumbnail?: string;
  tags?: string[];
}

// ===== UTILITY TYPES =====
export type DateFormatOptions = Intl.DateTimeFormatOptions;

// ===== REACT COMPONENT TYPES =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// ===== FORM TYPES =====
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
}

// ===== NAVIGATION TYPES =====
export interface RouteParams {
  blogId?: string;
  [key: string]: string | undefined;
}

// ===== HTTP HEADERS =====
export interface HttpHeaders {
  'Content-Type': string;
  'Access-Control-Allow-Origin'?: string;
  'Authorization'?: string;
  [key: string]: string | undefined;
}