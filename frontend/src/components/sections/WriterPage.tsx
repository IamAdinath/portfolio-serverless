
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import 'highlight.js/styles/github.css';
import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml';

import './WriterPage.css';
import { CreateDraftBlogPost, getPresignedUrl, uploadFileToS3 } from '../common/userAPI'; // Your API helpers
import { useToast } from '../common/ToastProvider';

const lowlight = createLowlight();
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('html', html);

// --- Custom Image Extension to allow 'data-id' attribute for placeholders ---
const CustomImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id': { default: null },
    };
  },
});

// --- ORIGINAL MENU BAR with the new Image Button ---
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
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>List</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
      
      {/* --- ADDED IMAGE BUTTON --- */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current?.click()} title="Add Image">
        <FontAwesomeIcon icon={faImage} />
      </button>
    </div>
  );
};


// --- MAIN WRITER PAGE COMPONENT ---
const WriterPage = () => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { addToast } = useToast();
  
  // ✅ Pre-generate a unique ID for this editing session.
  const [draftId] = useState(() => uuidv4());
  const imageCounter = useRef(0); // To keep track of image index (image_0, image_1, etc.)


  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      CustomImage.configure({ inline: false }),
      Dropcursor,
    ],
    content: ``,
  });

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return;

    const placeholderId = `placeholder-${Date.now()}`;
    const loadingGif = '/stickman-pulling-file.gif'; // Your loading GIF

    // Insert the placeholder image into the editor immediately
    // editor.chain().focus().setImage({ src: loadingGif, 'data-id': placeholderId }).run();

    try {
      // ✅ Use the pre-generated draftId for the S3 key
      const imageKey = `posts/${draftId}/image_${imageCounter.current++}.jpg`;
      const fileType = imageKey.split('.').pop() || 'jpg';

      // 1. Get a presigned URL for our specific S3 key
      const presignedData = await getPresignedUrl( imageKey, fileType );
      if (!presignedData || !presignedData.url) throw new Error('Failed to get presigned URL.');

      // 2. Upload the file directly to S3
      const finalImageUrl = await uploadFileToS3(presignedData.url, file);

      // 3. Find the placeholder and replace its src with the final URL
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
      // You could add logic here to remove the failed placeholder from the editor
    }
  }, [editor, draftId, addToast]);


  const handleSave = async () => {
    if (!editor || !title.trim()) {
      addToast('error', 'Please enter a title before saving.');
      return;
    }
    setIsSaving(true);

    const contentHTML = editor.getHTML();
    const doc = new DOMParser().parseFromString(contentHTML, 'text/html');
    const finalImageUrls = Array.from(doc.querySelectorAll('img')).map(img => img.src).filter(src => !src.includes('stickman-pulling-file.gif'));

    const blogPostPayload = {
      id: draftId, // ✅ Send the pre-generated ID to the backend
      title: title,
      content: contentHTML,
      images: finalImageUrls,
    };

    try {
      await CreateDraftBlogPost(blogPostPayload);
      addToast('success', 'Blog post saved successfully!');
      
      setTitle('');
      editor.commands.clearContent();
      // Reset for a new post by generating a new draftId (not strictly needed, but good practice if staying on page)
      // setDraftId(uuidv4()); 
    } catch (error: any) {
      console.error('API Error:', error);
      addToast('error', `An error occurred: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Drag and Drop Handlers ---
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
      <h1>Create a New Post</h1>

      <input
        type="text"
        className="title-input"
        placeholder="Post Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSaving}
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
      
      <button className="save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save and Publish'}
      </button>
    </div>
  );
};

export default WriterPage;