import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Typography from '@mui/material/Typography';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
   Bienvenido a Saber y Ganar
  </Typography>
  <App />
  <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 4 }}>
    wiq_6B
  </Typography>
</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
