import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Context } from './index';
import { check } from './http/userAPI';
import { Spinner } from 'react-bootstrap';
import Footer from './components/Footer';
import { BasketProvider } from './context/BasketContext';
import { fetchFavorites } from './http/deviceAPI';

import './App.css';

const App = observer(() => {
  const { user, device } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check()
    .then((data) => {
      user.setUser(data); // <--- здесь данные пользователя с ролью
      user.setIsAuth(true);
    })
    .finally(() => setLoading(false));
  
  }, []);

  useEffect(() => {
    if (user.isAuth) {
      fetchFavorites().then(data => device.setFavoriteDevices(data));
    }
  }, [user.isAuth, device]);

  if (loading) {
    return <Spinner animation={"grow"} />;
  }

  return (
    <BasketProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <main>
            <AppRouter />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </BasketProvider>
  );
});

export default App;
