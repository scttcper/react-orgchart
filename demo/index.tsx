import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// HMR Code Snippet Example
if (import.meta.hot) {
  // @ts-expect-error
  import.meta.hot.accept(({ module: _module }) => {
    // Accept the module, apply it into your application.
  });
}
