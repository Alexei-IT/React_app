// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.scss';
import './styles/components.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store'; // Теперь store существует
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();