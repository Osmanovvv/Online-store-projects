import React from 'react';
import { Container, Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';
import { BsTrash, BsPlusCircle, BsDashCircle } from 'react-icons/bs';
import { useBasket } from '../context/BasketContext';

const BasketPage = () => {
  const { basketItems, removeFromBasket, updateQuantity } = useBasket();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    updateQuantity(id, newQuantity);
  };

  const calculateTotal = () => {
    return basketItems.reduce((total, item) => total + item.sale_price * item.quantity, 0);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Корзина</h2>
      <Row>
        <Col md={8}>
          {basketItems.length === 0 ? (
            <Card className="p-4 shadow-sm">
              <h5 className="text-center">Ваша корзина пуста</h5>
            </Card>
          ) : (
            basketItems.map(item => (
              <Card key={item.id} className="mb-4 p-3 shadow-sm">
                <Row>
                  <Col md={3}>
                    <img
                      src={process.env.REACT_APP_API_URL + item.img}
                      alt={item.name}
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col md={6}>
                    <h5>{item.name}</h5>
                    <p>{item.sale_price} руб.</p>
                    <InputGroup className="mb-2">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <BsDashCircle />
                      </Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                        min="1"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <BsPlusCircle />
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={3} className="text-center">
                    <Button
                      variant="outline-danger"
                      onClick={() => removeFromBasket(item.id)}
                    >
                      <BsTrash /> Удалить
                    </Button>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>

        <Col md={4}>
          <Card className="p-4 shadow-sm">
            <h5>Итого</h5>
            <hr />
            <Row>
              <Col>
                <h6>Общая сумма:</h6>
              </Col>
              <Col className="text-right">
                <h6>{calculateTotal()} руб.</h6>
              </Col>
            </Row>
            <Button variant="outline-success" className="w-100 mt-3">
              Перейти к оформлению
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BasketPage;
