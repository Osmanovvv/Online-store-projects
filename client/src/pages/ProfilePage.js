import React, { useContext, useState, useEffect } from 'react';
import { Container, Nav, Tab, Row, Col, Card, Button, Form, Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { BsHeart, BsBoxSeam, BsGear, BsPersonCircle, BsCartPlus } from 'react-icons/bs';
import profileImage from '../assets/profile.png';
import { fetchFavorites, removeFavorite } from '../http/deviceAPI';

const ProfilePage = observer(() => {
  const { user } = useContext(Context);
  const [newName, setNewName] = useState(user.user.name || '');
  const [newEmail, setNewEmail] = useState(user.user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [addedToBasket, setAddedToBasket] = useState(false);

  useEffect(() => {
    if (user.isAuth) {  // Проверяем, авторизован ли пользователь
      fetchFavorites()
        .then(data => setFavorites(data))
        .catch(err => console.error('Ошибка при загрузке избранного', err));
    }
  }, [user.isAuth]);  // Зависимость от состояния авторизации

  const handleRemoveFavorite = async (deviceId) => {
    try {
      await removeFavorite(deviceId);
      setFavorites(prev => prev.filter(item => item.deviceId !== deviceId));
    } catch (error) {
      console.error('Ошибка при удалении из избранного', error);
    }
  };

  const handleAddToBasket = (e, device) => {
    e.stopPropagation(); // предотвратить переход по карточке
    // Здесь можно добавить логику добавления устройства в корзину
    console.log('Добавлено в корзину:', device);
    setAddedToBasket(true);
    setTimeout(() => setAddedToBasket(false), 2000);
  };

  const handleUpdate = () => {
    alert('Данные обновлены!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Убираем токен из localStorage
    user.setUser({});                  // Очищаем данные пользователя
    user.setIsAuth(false);             // Устанавливаем статус авторизации в false
    alert('Вы вышли из аккаунта');
  };

  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="profile">
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column gap-2">
              <Nav.Item>
                <Nav.Link eventKey="profile"><BsPersonCircle /> Мои данные</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="favorites"><BsHeart /> Избранное</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders"><BsBoxSeam /> История заказов</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings"><BsGear /> Настройки</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card className="p-4 shadow-sm">
                  <Row className="align-items-center">
                    <Col md={4} className="text-center border-end">
                      <Image
                        src={profileImage}
                        roundedCircle
                        width={150}
                        height={150}
                        className="mb-3"
                      />
                      <h4 className="mb-1">{user.user.name || 'Пользователь'}</h4>
                      <p className="text-muted">{user.user.email}</p>
                      <Button variant="outline-danger" onClick={handleLogout}>
                        Выйти из аккаунта
                      </Button>
                    </Col>

                    <Col md={8}>
                      <h3 className="mb-4">Редактировать профиль</h3>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Новый email</Form.Label>
                          <Form.Control
                            type="email"
                            value={newEmail}
                            placeholder="example@mail.com"
                            onChange={e => setNewEmail(e.target.value)}
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Новый пароль</Form.Label>
                          <Form.Control
                            type="password"
                            value={newPassword}
                            placeholder="Введите новый пароль"
                            onChange={e => setNewPassword(e.target.value)}
                          />
                        </Form.Group>

                        <Button variant="outline-success" onClick={handleUpdate}>
                          Сохранить изменения
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="favorites">
                <h4 className="mb-3">Избранное</h4>
                {favorites.length === 0 ? (
                  <p className="text-muted">У вас пока нет избранных товаров.</p>
                ) : (
                  favorites.map(fav => (
                    <Card key={fav.id} className="mb-3 p-3 shadow-sm">
                      <Row>
                        <Col md={3}>
                          {fav.device?.img ? (
                            <Card.Img
                              variant="top"
                              src={process.env.REACT_APP_API_URL + fav.device.img}
                              style={{ height: 180, objectFit: 'contain', maxWidth: '100%' }}
                            />
                          ) : (
                            <Image src={profileImage} rounded style={{ height: 180, objectFit: 'contain' }} />
                          )}
                        </Col>
                        <Col md={9}>
                          <h5>{fav.device?.name || 'Неизвестное устройство'}</h5>
                          <div>
                            {fav.device?.sale_price && <div>Цена: {fav.device.sale_price} руб.</div>}
                          </div>
                          <Button 
                            variant="outline-success"
                            size="sm"
                            onClick={(e) => handleAddToBasket(e, fav.device)}   
                            className="mt-4 me-3"
                          >
                            <BsCartPlus className="me-1" /> {addedToBasket ? "В корзине!" : "В корзину"}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="mt-4"  
                            onClick={() => handleRemoveFavorite(fav.deviceId)}
                          >
                            Удалить
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="orders">
                <h4 className="mb-3">История заказов</h4>
                {/* Здесь можно отобразить историю заказов, как ты уже сделал */}
              </Tab.Pane>

              <Tab.Pane eventKey="settings">
                <Card className="p-4 shadow-sm">
                  <h4>Настройки аккаунта</h4>
                  <p className="text-muted">Здесь в будущем можно будет управлять уведомлениями, сменой языка и т.д.</p>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
});

export default ProfilePage;
