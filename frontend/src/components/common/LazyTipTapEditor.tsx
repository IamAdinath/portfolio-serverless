/**
 * Lazy-loaded TipTap Editor to reduce initial bundle size
 * Only loads when actually needed in admin pages
 */
import React, { Suspense, lazy } from 'react';

// Lazy load the actual editor
const TipTapEditor = lazy(() => import('./TipTapEditor'));

interface LazyTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const EditorLoader: React.FC = () => (
  <div className="editor-loader" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    fontSize: '0.9rem',
    color: '#64748b'
  }}>
    Loading editor...
  </div>
);

const LazyTipTapEditor: React.FC<LazyTipTapEditorProps> = (props) => {
  return (
    <Suspense fallback={<EditorLoader />}>
      <TipTapEditor {...props} />
    </Suspense>
  );
};

export default LazyTipTapEditor;