import { jwtDecode } from "jwt-decode";
import { $authHost, $host } from "./index";

// Регистрация, логин, проверка, логаут
export const registration = async (email, password) => {
  const { data } = await $host.post('api/user/registration', { email, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  const decoded = jwtDecode(data.token);
  console.log("Decoded token:", decoded); // Проверьте, что роль есть в токене
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

// ЗАПРОСЫ НА ПОЛЬЗОВАТЕЛЕЙ
export const getUsers = (search = '', role = 'ALL') => {
  return $authHost.get('/api/user/all', { params: { search, role } })
    .then(response => response.data);
};

export const updateUserRole = (userId, newRole) => {
    return $authHost.patch(`/api/user/role/${userId}`, { role: newRole })
      .then(response => response.data);
  };  

export const deleteUser = (userId) => {
  return $authHost.delete(`/api/user/${userId}`)
    .then(response => response.data);
};


export const fetchStats = () => {
    return $authHost.get('/api/user/stats')
      .then(response => response.data);
  };
  
  