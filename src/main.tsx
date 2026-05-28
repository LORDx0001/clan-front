import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ClanProvider } from './context/ClanContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClanProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ClanProvider>
  </StrictMode>,
);
