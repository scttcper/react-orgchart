import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// HMR Code Snippet Example
// @ts-expect-error
if (import.meta.hot) {
  // @ts-expect-error
  import.meta.hot.accept(({ module }) => {
    // Accept the module, apply it into your application.
  });
}
