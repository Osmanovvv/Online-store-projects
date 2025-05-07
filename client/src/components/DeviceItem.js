import React, { useState, useContext, useEffect } from 'react';
import { Card, Col, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { useNavigate } from 'react-router-dom';
import { DEVICE_ROUTE } from "../utils/consts";
import { BsStarFill, BsHeart, BsHeartFill, BsCartPlus } from 'react-icons/bs';
import { addToBasket, addFavorite, removeFavorite, fetchFavorites } from '../http/deviceAPI';
import { useBasket } from "../context/BasketContext";
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

const DeviceItem = observer(({ device }) => {
    const { device: deviceStore } = useContext(Context);
    const navigate = useNavigate();

    const [addedToBasket, setAddedToBasket] = useState(false);
    const { addToBasket: addToBasketContext } = useBasket();

    const isFavorite = deviceStore.isFavorite(device.id); // Проверка, в избранном ли товар

    useEffect(() => {
        // Загружаем избранные товары при первом рендере
        if (deviceStore.favoriteDevices.length === 0) {
            fetchFavorites().then(data => deviceStore.setFavoriteDevices(data));
        }
    }, [deviceStore.favoriteDevices.length]);

    const handleAddToBasket = (e) => {
        e.stopPropagation(); // предотвратить переход по карточке
        addToBasketContext(device);
        setAddedToBasket(true);
        setTimeout(() => setAddedToBasket(false), 2000);
    };

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();
        try {
            if (isFavorite) {
                await removeFavorite(device.id);
                deviceStore.setFavoriteDevices(deviceStore.favoriteDevices.filter(f => f.deviceId !== device.id));
            } else {
                const added = await addFavorite(device.id);
                deviceStore.setFavoriteDevices([...deviceStore.favoriteDevices, added]);
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при обновлении избранного');
        }
    };

    return (
        <Col md={3} sm={4} xs={6} className="mb-4">
            <Card 
                className="h-100 shadow-sm rounded-4 border-0 position-relative transform-hover"
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease-in-out' }}
                onClick={() => navigate(DEVICE_ROUTE + '/' + device.id)}
            >
                {/* Иконка избранного */}
                <div 
                    className="position-absolute top-0 end-0 m-2"
                    onClick={handleToggleFavorite}
                >
                    <Button variant="light" size="sm" className="rounded-circle p-1 border-0">
                        {isFavorite ? <BsHeartFill color="crimson" /> : <BsHeart color="crimson" />}
                    </Button>
                </div>

                <Image 
                    src={process.env.REACT_APP_API_URL + device.img}
                    className="rounded-top w-100"
                    style={{ height: 180, objectFit: 'contain', padding: '1rem' }}
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between text-muted mb-2">
                        <span className="fw-medium">{device.name}</span>
                        <span className="d-flex align-items-center gap-1">
                            {device.rating} <BsStarFill color="gold" />
                        </span>
                    </div>
                    <div className="text-secondary small mb-2">{device.brand}</div>

                    {/* Кнопка добавления в корзину */}
                    <Button 
                        variant="outline-success"
                        size="sm"
                        onClick={handleAddToBasket}   
                        className="align-self-end"
                    >
                        <BsCartPlus className="me-1" /> {addedToBasket ? "В корзине!" : "В корзину"}
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
});

export default DeviceItem;
