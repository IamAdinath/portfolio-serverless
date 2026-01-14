import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from './config/awsConfig';


Amplify.configure(amplifyConfig);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
