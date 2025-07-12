// App.tsx - CORRECTED
import React from 'react'; // We can remove 'useState' as it's no longer needed here
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AboutMe from './components/sections/AboutMe';
import Portfolio from './Portfolio';
import Resume from './components/sections/Resume';  
import BlogList from './components/sections/BlogList';
import AuthPage from './components/sections/AuthPage';
import WriterPage from './components/sections/WriterPage';
import { ToastProvider } from './components/common/ToastProvider';

const App: React.FC = () => {
  return (
    <ToastProvider> 
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/writer" element={<WriterPage />} />
        </Routes>
        <Footer />
      </Router>
    </ToastProvider>
  );
};

export default App;