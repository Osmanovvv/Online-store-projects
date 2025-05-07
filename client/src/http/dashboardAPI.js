import { $authHost } from './index'; 

export const getStats = async () => {
  try {
    const { data } = await $authHost.get('/api/admin/stats'); // Проверь, чтобы этот путь был правильным
    return data;
  } catch (error) {
    console.error('Ошибка при получении статистики', error);
    throw error;
  }
};

export const getUserReport = async (start, end) => {
  const params = new URLSearchParams();
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  const { data } = await $authHost.get('/api/admin/report?' + params.toString());
  return data;
};

export const getRolesReport = async (startDate, endDate) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const token = localStorage.getItem('token');
  if (!token) return null; // не делаем запрос, если не авторизован
  
  const { data } = await $authHost.get('/api/admin/roles-report?' + params.toString());
  return data;
};

