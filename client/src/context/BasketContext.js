// src/context/BasketContext.js
import React, { createContext, useContext, useState } from 'react';

// Создаем контекст для корзины
const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

// Провайдер контекста
export const BasketProvider = ({ children }) => {
  const [basketItems, setBasketItems] = useState([]);

  const addToBasket = (item) => {
    setBasketItems((prevItems) => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromBasket = (id) => {
    setBasketItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setBasketItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket, updateQuantity }}>
      {children}
    </BasketContext.Provider>
  );
};
