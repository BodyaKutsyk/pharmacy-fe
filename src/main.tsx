import React from 'react';

import ReactDOM from 'react-dom/client';

import './index.css';
import Routes from './routes/index.tsx';
import { Providers } from '@/providers.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Providers>
      <Routes />
    </Providers>
  </React.StrictMode>,
);
