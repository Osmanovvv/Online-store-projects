import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button, Form, Table, Badge, Dropdown, InputGroup } from 'react-bootstrap';
import { BsSearch, BsFilter, BsClockHistory } from 'react-icons/bs';
import UserList from '../components/UserList';
import { getStats } from '../http/dashboardAPI';
import { fetchOrders, updateOrderStatus } from '../http/orderAPI'; // You'll need to create these API functions
import { Context } from '../index';

const Manager = () => {
  const { user } = useContext(Context);
  
  // States
//   const [stats, setStats] = useState({ usersCount: 0, ordersCount: 0, totalQuantity: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);  // Присваиваем данные в стейт
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load data. Please check server logs and try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  
  
  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state after successful API call
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Не удалось обновить статус заказа. Пожалуйста, попробуйте снова.');
    }
  };
  
  // Filter orders based on search query and filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchMatch = 
      searchQuery === '' || 
      order.id.toString().includes(searchQuery) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    
    // Date filter
    let dateMatch = true;
    if (dateFilter.from) {
      dateMatch = dateMatch && new Date(order.createdAt) >= new Date(dateFilter.from);
    }
    if (dateFilter.to) {
      dateMatch = dateMatch && new Date(order.createdAt) <= new Date(dateFilter.to);
    }
    
    return searchMatch && statusMatch && dateMatch;
  });
  
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter({ from: '', to: '' });
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Менеджер-панель управления заказами</h2>

      <Tabs defaultActiveKey="orders" id="manager-tabs" className="mb-3" justify>
        <Tab eventKey="orders" title="Управление заказами">
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text><BsSearch /></InputGroup.Text>
                    <Form.Control
                      placeholder="Поиск по номеру заказа, email или имени клиента"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">В ожидании</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="d-flex justify-content-end">
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={5}>
                  <InputGroup>
                    <InputGroup.Text><BsClockHistory /></InputGroup.Text>
                    <Form.Control
                      type="date"
                      placeholder="От"
                      value={dateFilter.from}
                      onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                    />
                    <Form.Control
                      type="date"
                      placeholder="До"
                      value={dateFilter.to}
                      onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                    />
                  </InputGroup>
                </Col>
                <Col md={7} className="text-end">
                  <span className="text-muted">
                    Показано {filteredOrders.length} из {orders.length} заказов
                  </span>
                </Col>
              </Row>
              
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>№ заказа</th>
                        <th>Дата</th>
                        <th>Клиент</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
  {filteredOrders.length > 0 ? (
    filteredOrders.map(order => (
      <tr key={order.id}>
        <td>#{order.id}</td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td>
          <div>{order.user.email}</div> {/* Здесь можешь вывести email пользователя */}
          <small className="text-muted">{order.user.name}</small>
        </td>
        <td>{order.totalPrice} ₽</td> {/* Если есть поле с суммой заказа */}
        <td>
          <Badge bg={getStatusBadgeVariant(order.status)}>
            {order.status === 'pending' && 'В ожидании'}
            {order.status === 'processing' && 'В обработке'}
            {order.status === 'shipped' && 'Отправлен'}
            {order.status === 'delivered' && 'Доставлен'}
            {order.status === 'cancelled' && 'Отменен'}
          </Badge>
        </td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Действия
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange(order.id, 'pending')}>
                В ожидании
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(order.id, 'processing')}>
                В обработке
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(order.id, 'shipped')}>
                Отправлен
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(order.id, 'delivered')}>
                Доставлен
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleStatusChange(order.id, 'cancelled')}>
                Отменить заказ
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4">
        Заказы не найдены
      </td>
    </tr>
  )}
</tbody>

                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Manager;