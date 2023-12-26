// App.tsx
import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import Portfolio from './Portfolio';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './App.css'; // Import your global styles

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <div className="app">
        <Portfolio />
      </div>
    </ChakraProvider>
  );
};

export default App;
