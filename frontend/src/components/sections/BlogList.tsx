import React from 'react';
import Blog from './Blog'; // Import the Blog component
import SuggestedBlogs from './SuggestedBlogs'; // Import the SuggestedBlogs component

const BlogList: React.FC = () => {
  const blogs = [
    {
      id: 1,
      title: 'Understanding React Hooks',
      content: 'Hooks are a new addition in React 16.8 that allow you to use state and other React features without writing a class.',
      author: 'Jane Smith',
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      content: 'JavaScript is a versatile language that allows you to build complex applications with simple constructs.',
      author: 'Michael Johnson',
    },
    {
      id: 3,
      title: 'State Management with Redux',
      content: 'Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently.',
      author: 'Emily Brown',
    },
  ];

  const suggestedBlogs = [
    {
      id: 4,
      title: 'Getting Started with TypeScript',
      author: 'Alice Green',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual thumbnail URL
    },
    {
      id: 5,
      title: 'CSS Grid vs Flexbox',
      author: 'Bob White',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual thumbnail URL
    },
    {
      id: 6,
      title: 'Understanding RESTful APIs',
      author: 'Carol Black',
      thumbnail: 'https://via.placeholder.com/150', // Replace with actual thumbnail URL
    },
  ];

  return (
    <div>
      {blogs.map((blog) => (
        <Blog 
          key={blog.id} 
          id={blog.id} 
          title={blog.title} 
          content={blog.content} 
          author={blog.author} 
        />
      ))}
      <SuggestedBlogs suggestions={suggestedBlogs} /> {/* Footer-like suggestion section */}
    </div>
  );
};

export default BlogList;
