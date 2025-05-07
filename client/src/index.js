// index.js
import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import UserStore from './store/UserStore'; // правильный импорт
import DeviceStore from './store/DeviceStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),  // Создание экземпляра UserStore
      device: new DeviceStore(),
    }}>
      <App />
    </Context.Provider> 
  </React.StrictMode>
);
