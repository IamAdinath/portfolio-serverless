/**
 * Actual TipTap Editor implementation - loaded lazily
 */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';

// Tiptap extensions - only load what's needed
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import History from '@tiptap/extension-history';
import TiptapImage from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

// Only load essential languages for syntax highlighting
import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml';

import { FontAwesomeIcon, faImage } from '../../utils/iconLibrary';
import { getPresignedUrl } from '../common/userAPI';
import { useToast } from '../common/ToastProvider';

// Setup syntax highlighting
const lowlight = createLowlight();
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('html', html);

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing..." 
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      ListItem,
      History,
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Dropcursor,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'js',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        placeholder,
      },
    },
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;

    setIsUploading(true);
    try {
      const presignedResponse = await getPresignedUrl(file.name);
      if (!presignedResponse) {
        throw new Error('Failed to get upload URL');
      }

      // Upload to S3
      const uploadResponse = await fetch(presignedResponse.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Insert image into editor
      editor.chain().focus().setImage({ src: presignedResponse.publicUrl }).run();
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Image upload failed:', error);
      showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  }, [editor, showToast]);

  const triggerImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
    // Reset input
    event.target.value = '';
  }, [handleImageUpload]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="tiptap-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          List
        </button>
        <button
          type="button"
          onClick={triggerImageUpload}
          disabled={isUploading}
        >
          <FontAwesomeIcon icon={faImage} />
          {isUploading ? ' Uploading...' : ' Image'}
        </button>
      </div>
      
      <EditorContent editor={editor} />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default TipTapEditor;