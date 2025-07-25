import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

// Language imports for syntax highlighting
import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml'; // for html

import './WriterPage.css';
import { CreateDraftBlogPost, UpdateBlogPost, getPresignedUrl, uploadFileToS3 } from '../common/userAPI';
import { useToast } from '../common/ToastProvider';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const lowlight = createLowlight();
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('html', html);

const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id': { default: null },
    };
  },
});

const MenuBar = ({ editor, onImageUpload }: { editor: Editor | null, onImageUpload: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImageUpload(file);
  };

  return (
    <div className="menu-bar">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
      <button onClick={() => fileInputRef.current?.click()} title="Add Image">
        <FontAwesomeIcon icon={faImage} />
      </button>
    </div>
  );
};


// --- MAIN WRITER PAGE COMPONENT ---
const WriterPage = () => {
  const [blogId, setBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const { addToast } = useToast();

  const debouncedTitle = useDebounce(title, 1500);
  const debouncedContent = useDebounce(content, 2000);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({ lowlight }),
      CustomImage.configure({ inline: false }),
      Dropcursor,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setStatus('idle');
    },
  });

  useEffect(() => {
    if (debouncedTitle.trim() && !blogId) {
      setStatus('saving');
      const createDraft = async () => {
        try {
          const newPost = await CreateDraftBlogPost({ title: debouncedTitle });
          if (newPost && newPost.id) {
            setBlogId(newPost.id);
            setStatus('saved');
            addToast('info', 'Draft created. Auto-saving is now active.');
          }
        } catch (error) {
          console.error("Draft creation failed:", error);
          addToast('error', 'Could not create draft.');
          setStatus('idle');
        }
      };
      createDraft();
    }
  }, [debouncedTitle, blogId, addToast]);

  useEffect(() => {
    if (blogId && debouncedContent && status === 'idle') {
      setStatus('saving');
      const autoSaveContent = async () => {
        try {
          await UpdateBlogPost(blogId, { content: debouncedContent });
          setStatus('saved');
        } catch (error) {
          console.error("Auto-save failed:", error);
          addToast('error', 'Auto-save failed. Check your connection.');
          setStatus('idle'); // Allow retry
        }
      };
      autoSaveContent();
    }
  }, [debouncedContent, blogId, status, addToast]);


  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;
    const placeholderId = `placeholder-${Date.now()}`;
    const loadingGif = '/stickman-pulling-file.gif';

    editor.chain().focus().setImage({ src: loadingGif, 'data-id': placeholderId }).run();

    try {
      const presignedData = await getPresignedUrl({ fileName: file.name, fileType: file.type });
      if (!presignedData || !presignedData.url) throw new Error('Failed to get presigned URL.');
      
      const finalImageUrl = await uploadFileToS3(presignedData.url, file);

      const { state, dispatch } = editor.view;
      const { tr } = state;
      let placeholderPos: number | null = null;
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs['data-id'] === placeholderId) {
          placeholderPos = pos;
        }
      });
      if (placeholderPos !== null) {
        tr.setNodeMarkup(placeholderPos, undefined, { src: finalImageUrl, 'data-id': null });
        dispatch(tr);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      addToast('error', 'Image upload failed.');
    }
  }, [editor, addToast]);

  const handlePublish = async () => {
    if (!blogId) {
      addToast('error', 'Please enter a title to create a draft first.');
      return;
    }
    if (!editor) return;

    setStatus('saving');
    try {
      const finalContent = editor.getHTML();
      const doc = new DOMParser().parseFromString(finalContent, 'text/html');
      const finalImageUrls = Array.from(doc.querySelectorAll('img')).map(img => img.src);

      await UpdateBlogPost(blogId, { 
        title: title,
        content: finalContent,
        images: finalImageUrls,
        status: 'published' 
      });
      addToast('success', 'Blog post published successfully!');
      
      setTitle('');
      setContent('');
      editor.commands.clearContent(true);
      setBlogId(null);
      setStatus('idle');

    } catch (error) {
      addToast('error', 'Failed to publish post.');
      setStatus('saved');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  return (
    <div className="writer-container">
      <div className="writer-header">
        <h1>Create a New Post</h1>
        <span className="save-status">
          {status === 'saving' ? 'Saving...' : status === 'saved' ? 'All changes saved' : ''}
        </span>
      </div>

      <input
        type="text"
        className="title-input"
        placeholder="Post Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div 
        className="editor-wrapper" 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <MenuBar editor={editor} onImageUpload={handleImageUpload} />
        <EditorContent editor={editor} />
        {isDragging && <div className="drop-zone-overlay">Drop image here</div>}
      </div>
      
      <button className="publish-button" onClick={handlePublish} disabled={status === 'saving' || !blogId}>
        {status === 'saving' ? 'Publishing...' : 'Publish'}
      </button>
    </div>
  );
};

export default WriterPage;