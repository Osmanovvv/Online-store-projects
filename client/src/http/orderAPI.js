import {$authHost} from './index';

// Функция получения заказов с сервер
export const fetchOrders = async () => {
  try {
    const { data } = await $authHost.get('api/orders');
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Обновление статуса заказа
export const updateOrderStatus = async (orderId, status) => {
  try {
    const {data} = await $authHost.put(`api/order/${orderId}`, {status});
    return data;  // Возвращаем обновленные данные
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
