import React, { useEffect, useState } from 'react';
import { Table, Form, InputGroup, Button } from 'react-bootstrap';
import { getUsers, updateUserRole, deleteUser } from '../http/userAPI';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = () => {
    getUsers(search, roleFilter).then(data => setUsers(data));
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole).then(() => {
      fetchUsers(); // после смены роли — перезагрузить пользователей
    });
  };

  const handleDeleteUser = (userId) => {
    deleteUser(userId).then(() => {
      fetchUsers(); // после удаления — перезагрузить пользователей
    });
  };

  return (
    <div className="mt-5">
      <h4 className="mb-3">Пользователи</h4>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Поиск по email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Form.Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">Все роли</option>
          <option value="USER">Пользователи</option>
          <option value="MANAGER">Менеджеры</option>
          <option value="ADMIN">Администраторы</option>
        </Form.Select>
        <Button variant="outline-secondary" onClick={() => setSearch('')}>Очистить</Button>
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Изменить роль</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Form.Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </td>
              <td>
                <Button variant="outline-danger" onClick={() => handleDeleteUser(user.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center">Нет пользователей</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
