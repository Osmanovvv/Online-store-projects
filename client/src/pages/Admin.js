import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button, Form } from 'react-bootstrap';
import { BsPhone, BsTags, BsLayers, BsGraphUp } from 'react-icons/bs';
import CreateBrand from '../components/modals/CreateBrand';
import CreateDevice from '../components/modals/CreateDevice';
import CreateType from '../components/modals/CreateType';
import UserList from '../components/UserList';
import { getStats, getUserReport, getRolesReport } from '../http/dashboardAPI';
import { Context } from '../index';


const Admin = () => {
  const { user } = useContext(Context)

  // Сначала определяем все состояния
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);
  const [stats, setStats] = useState({ usersCount: 0, ordersCount: 0, totalQuantity: 0 });
  const [reportData, setReportData] = useState(null);
  const [rolesData, setRolesData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // useEffect для загрузки статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (e) {
        console.error('Ошибка при получении статистики:', e);
      }
    };
    fetchStats();
  }, []);

  // useEffect для генерации отчета после авторизации
  useEffect(() => {
    if (user.isAuth) {
      generateReport(); 
    }
  }, [user.isAuth]);

  // Функция для генерации отчетов
  const generateReport = async () => {
    setLoading(true);
    try {
      const [userData, roleReport] = await Promise.all([
        getUserReport(fromDate, toDate),
        getRolesReport(fromDate, toDate)
      ]);
      setReportData(userData);
      setRolesData(roleReport);
      setShowReport(true);
    } catch (e) {
      console.error('Ошибка при создании отчётов:', e);
      alert('Ошибка при создании отчётов. Проверьте логи сервера.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Админ-панель управления магазином</h2>

      <Tabs defaultActiveKey="catalog" id="admin-tabs" className="mb-3" justify>
        <Tab eventKey="catalog" title="Каталог">
          <Row className="g-4 justify-content-center mt-3">
            <Col md={4}>
              <Card onClick={() => setTypeVisible(true)} className="text-center shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <BsLayers size={40} className="mb-2" />
                  <Card.Title>Добавить тип</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={() => setBrandVisible(true)} className="text-center shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <BsTags size={40} className="mb-2" />
                  <Card.Title>Добавить бренд</Card.Title>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card onClick={() => setDeviceVisible(true)} className="text-center shadow-sm hover-shadow" style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <BsPhone size={40} className="mb-2" />
                  <Card.Title>Добавить устройство</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="users" title="Пользователи">
          <UserList />
        </Tab>

        <Tab eventKey="dashboard" title="Статистика">
          <Row className="g-4 justify-content-center mt-3">
            <Col md={4}>
              <Card className="text-center shadow-sm hover-shadow">
                <Card.Body>
                  <BsGraphUp size={40} className="mb-2" />
                  <Card.Title>Пользователей</Card.Title>
                  <Card.Text>{stats.usersCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm hover-shadow">
                <Card.Body>
                  <BsGraphUp size={40} className="mb-2" />
                  <Card.Title>Заказов</Card.Title>
                  <Card.Text>{stats.ordersCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm hover-shadow">
                <Card.Body>
                  <BsGraphUp size={40} className="mb-2" />
                  <Card.Title>Общее количество товаров</Card.Title>
                  <Card.Text>{stats.totalQuantity}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="shadow-sm p-3">
                <h5 className="mb-3">Фильтр по дате</h5>
                <Form>
                  <Row>
                    <Col>
                      <Form.Group controlId="fromDate">
                        <Form.Label>От</Form.Label>
                        <Form.Control
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="toDate">
                        <Form.Label>До</Form.Label>
                        <Form.Control
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md="auto" className="d-flex align-items-end">
                      <Button onClick={generateReport} disabled={loading}>
                        {loading ? 'Генерация...' : 'Создать отчёты'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>

          {showReport && reportData && rolesData && (
            <Row className="justify-content-center mt-4 g-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Отчёт по активности пользователей</h5>
                    <p><strong>Дата отчёта:</strong> {reportData.date}</p>
                    <p><strong>Период:</strong> {reportData.period}</p>
                    <p><strong>Всего регистраций за период:</strong> {reportData.totalRegistrations}</p>
                    <p><strong>Всего пользователей:</strong> {reportData.totalUsers}</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Отчёт по ролям пользователей</h5>
                    <p><strong>Дата отчёта:</strong> {rolesData.date}</p>
                    <p><strong>Период:</strong> {rolesData.period}</p>
                    <p><strong>Всего пользователей:</strong> {rolesData.total}</p>
                    <p><strong>Пользователей с ролью user:</strong> {rolesData.user}</p>
                    <p><strong>Менеджеров:</strong> {rolesData.manager}</p>
                    <p><strong>Админов:</strong> {rolesData.admin}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

        </Tab>
      </Tabs>

      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
      <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
    </Container>
  );
};

export default Admin;
