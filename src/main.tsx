import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter basename="/SIMPLE_BLOG_BACK_OFFICE/">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
