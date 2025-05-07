import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchOneDevice } from "../http/deviceAPI";
import { BsStar } from "react-icons/bs"; // Иконки для рейтинга
import { useBasket } from "../context/BasketContext"; // Импортируем хук для корзины

const DevicePage = () => {
  const [device, setDevice] = useState({ info: [] });
  const { id } = useParams();
  const { addToBasket } = useBasket(); // Хук для добавления в корзину
  const [addedToBasket, setAddedToBasket] = useState(false); // Состояние для отслеживания добавления в корзину

  useEffect(() => {
    fetchOneDevice(id).then((data) => setDevice(data));
  }, [id]);

  const handleAddToBasket = () => {
    addToBasket(device); // Добавляем товар в корзину
    setAddedToBasket(true); // Меняем состояние на добавленный товар
    setTimeout(() => setAddedToBasket(false), 2000); // Через 2 секунды сбрасываем надпись
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        {/* Колонка с изображением */}
        <Col md={5} className="d-flex justify-content-center mb-4 mb-md-0">
          <Image
            width={350}
            height={350}
            src={process.env.REACT_APP_API_URL + device.img}
            className="rounded-3 shadow-lg"
            style={{ objectFit: "cover", maxHeight: "100%" }}
          />
        </Col>

        {/* Информация о смартфоне */}
        <Col
          md={4}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <h1 className="text-center mb-3">{device.name}</h1>

          {/* Рейтинг */}
          <div
            className="d-flex align-items-center justify-content-center mb-4"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "3px solid #ddd",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f7f7f7",
            }}
          >
            <span style={{ fontSize: "2.5rem", color: "#ffd700" }}>
              {device.rating}
            </span>
          </div>

          {/* Звезды для рейтинга */}
          <div className="d-flex justify-content-center mb-3">
            {[...Array(5)].map((_, index) => (
              <BsStar
                key={index}
                color={index < device.rating ? "#ffd700" : "#ddd"}
                size={30}
              />
            ))}
          </div>

          {/* Кнопка добавления в корзину */}
          <Card
            className="d-flex flex-column align-items-center justify-content-center p-4 shadow-sm"
            style={{
              width: "100%",
              border: "none",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
              borderRadius: "15px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <h4 className="text-center mb-3">Цена: {device.sale_price} руб.</h4>

            {/* Кнопка с изменением текста */}
            <Button
              variant="outline-dark"
              className="w-100"
              style={{
                padding: "10px 20px",
                fontSize: "1.1rem",
                borderRadius: "25px",
                fontWeight: "bold",
              }}
              onClick={handleAddToBasket}
            >
              {addedToBasket ? "Добавлено в корзину!" : "Добавить в корзину"}
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Характеристики устройства */}
      <Row className="d-flex flex-column mt-4">
        <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>
          Характеристики
        </h2>
        {device.info.map((info, index) => (
          <Row
            key={info.id}
            className="my-2 p-3"
            style={{
              background: index % 2 === 0 ? "#f7f7f7" : "transparent",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Col xs={12} sm={4} className="fw-bold text-dark">
              {info.title}
            </Col>
            <Col xs={12} sm={8} className="text-muted">
              {info.description}
            </Col>
          </Row>
        ))}
      </Row>
    </Container>
  );
};

export default DevicePage;
