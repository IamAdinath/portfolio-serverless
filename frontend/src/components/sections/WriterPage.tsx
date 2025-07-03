// src/components/sections/WriterPage.tsx

import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';

// Language imports for syntax highlighting
import ts from 'highlight.js/lib/languages/typescript';
import js from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import html from 'highlight.js/lib/languages/xml'; // for html

import './WriterPage.css';

import { CreateBlogPost } from '../common/userAPI';

// Initialize and configure the syntax highlighter
const lowlight = createLowlight();
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('html', html);


// --- MENU BAR COMPONENT (Unchanged) ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
      <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>List</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
    </div>
  );
};


// --- MAIN WRITER PAGE COMPONENT ---
const WriterPage = () => {
  // NEW: State for title and saving status
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // State for drag-and-drop UI
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false, allowBase64: true }),
      Dropcursor,
    ],
    content: `
    `,
  });

  // NEW: API call handler to save the blog post
  const handleSave = async () => {
    if (!editor || !title.trim()) {
      alert('Please enter a title before saving.');
      return;
    }

    setIsSaving(true);
    const contentHTML = editor.getHTML();

    const blogPostPayload = {
      title: title,
      content: contentHTML,
    };

    try {
      // Replace with your actual API endpoint
      const response = await CreateBlogPost(blogPostPayload);
      
      // Optionally, clear the form or redirect
      setTitle('');
      editor.commands.clearContent();
      // window.location.href = `/blog/${result.blogId}`;

    } catch (error: any) {
      console.error('API Error:', error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      // Re-enable the form fields
      setIsSaving(false);
    }
  };

  // --- Drag and Drop Handlers (Unchanged) ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!editor) return;

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const imageUrl = readerEvent.target?.result as string;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  return (
    <div className="writer-container">
      <h1>Create a New Post</h1>

      {/* NEW: Input for the blog post title */}
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
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
        {isDragging && <div className="drop-zone-overlay">Drop image here</div>}
      </div>
      
      {/* NEW: Updated save button with loading state */}
      <button className="save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save and Publish'}
      </button>
    </div>
  );
};

export default WriterPage;