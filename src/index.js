import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css'
import './components/cards/Card.css'
import './components/sideBar/Bars.css'
import './pages/Dashboard.css'
import './Auth/Auth.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Menucontext from './context/Menucontext';
import Windowcontext from './context/Windowcontext';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Windowcontext>
    <Menucontext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
   </Menucontext>
   </Windowcontext>
  </React.StrictMode>
);


reportWebVitals();
