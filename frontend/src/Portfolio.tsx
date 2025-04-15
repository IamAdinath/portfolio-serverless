// Portfolio.tsx
import React from 'react';
import { Pane, Heading, Paragraph, Text, Strong, Avatar } from 'evergreen-ui'; // Added necessary components

const Portfolio: React.FC = () => {
  const latestBlogs = [
    { id: 1, title: 'My Journey into Web Development', snippet: 'A quick look at how I started...' },
    { id: 2, title: 'Exploring Evergreen UI', snippet: 'Why I chose this library for my portfolio...' },
    { id: 3, title: 'Tips for Aspiring Developers', snippet: 'Things I wish I knew when I started...' },
  ];

  const testimonials = [
    { id: 1, quote: 'Working with [Your Name] was a fantastic experience. Highly professional and skilled!', author: 'Jane Doe, Project Manager @ Acme Corp' },
    { id: 2, quote: 'Delivered results beyond expectations. Clear communication and technical expertise.', author: 'John Smith, CEO @ StartupX' },
  ];

  return (
    <Pane paddingX={32} paddingY={24} maxWidth={960} marginX="auto"> 


      {/* Section 1: Introduction */}
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center" 
        textAlign="center"   
        paddingY={40}      
        borderBottom="muted" 
        marginBottom={40}
      >
        <Heading size={800} marginBottom={16}> {/* Larger heading */}
          Hi, I'm Adinath Gore!
        </Heading>
        <Paragraph size={500} maxWidth={600} marginBottom={32}> {/* Slightly larger paragraph, constrained width */}
          Welcome to my portfolio. I'm a Full-Stack Developer passionate about creating engaging and user-friendly web experiences. Explore my work and feel free to get in touch!
          
        </Paragraph>
        
        <Pane>
          <Avatar
            src="https://placehold.co/200x200/EEE/31343C" 
            name="Adinath Gore" 
            size={150}
          />
        </Pane>
      </Pane>

      {/* Section 2: Latest Blogs */}
      <Pane
        paddingY={40}
        borderBottom="muted" 
        marginBottom={40}
      >
        <Heading size={700} marginBottom={24} textAlign="center"> {/* Section title */}
          Latest Blog Posts
        </Heading>
        <Pane
          display="grid" 
          gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
          gap={24}
        >
          {latestBlogs.map((blog) => (
            <Pane
              key={blog.id}
              padding={16}
              border="default"
              borderRadius={4}
              elevation={1}
              backgroundColor="white"
            >
              <Heading size={500} marginBottom={8}>{blog.title}</Heading>
              <Paragraph size={400} color="muted">{blog.snippet}</Paragraph>
            </Pane>
          ))}
        </Pane>
          
          <Pane textAlign="center" marginTop={24}>
            <Text>See all posts...</Text> 
          </Pane>
      </Pane>

      {/* Section 3: Testimonials */}
      <Pane paddingY={40}>
        <Heading size={700} marginBottom={24} textAlign="center"> {/* Section title */}
          What People Say
        </Heading>
        <Pane display="flex" flexDirection="column" gap={20}> {/* Stack testimonials vertically with gap */}
          {testimonials.map((testimonial) => (
            <Pane
              key={testimonial.id}
              padding={20}
              borderLeft="4px solid #4299E1"
              backgroundColor="tint2"
              borderRadius={4}
            >
              <Paragraph size={400} fontStyle="italic" marginBottom={12}> {/* Italicize the quote */}
                "{testimonial.quote}"
              </Paragraph>
              <Text size={400} fontWeight={500}> {/* Use Text with stronger weight for author */}
                - {testimonial.author}
              </Text>
            </Pane>
          ))}
        </Pane>
      </Pane>

    </Pane>
  );
};

export default Portfolio;