import React, { useContext } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink, useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, PROFILE_ROUTE, MANAGER_ROUTE } from "../utils/consts";
import { Button, Container, Form, FormControl, InputGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { BsCart, BsPerson, BsSearch } from 'react-icons/bs';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    console.log(user);  // Проверь, что роль правильно сохраняется

    const navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuth(false);
    };
    

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
            <Container>
                {/* Логотип */}
                <NavLink to={SHOP_ROUTE} className="navbar-brand fs-4 fw-bold text-white">
                    КупиСмартфон
                </NavLink>

                {/* Поиск */}
                <Form className="d-none d-lg-flex mx-auto w-50">
                    <InputGroup>
                        <FormControl
                            type="search"
                            placeholder="Поиск смартфона..."
                            className="rounded-start"
                        />
                        <Button variant="outline-light">
                            <BsSearch />
                        </Button>
                    </InputGroup>
                </Form>

                {/* Кнопки */}
                <Nav className="ml-auto d-flex align-items-center gap-2">
                    {user.isAuth ? (
                        <>
                            {/* Кнопка для админа */}
                            {user.user.role === 'ADMIN' && (
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate(ADMIN_ROUTE)}
                                >
                                    Админ панель
                                </Button>
                            )}

                            {/* Кнопка для менеджера */}
                            {user.user.role === 'MANAGER' && (
                                <Button
                                    variant="outline-light"
                                    onClick={() => navigate(MANAGER_ROUTE)}
                                >
                                    Менеджер панель
                                </Button>
                            )}

                            {/* Профиль и корзина */}
                            <Button
                                variant="outline-light"
                                onClick={() => navigate(PROFILE_ROUTE)}
                            >
                                <BsPerson />
                            </Button>
                            <Button
                                variant="outline-light"
                                onClick={() => navigate('/basket')}
                            >
                                <BsCart />
                            </Button>
                            <Button
                                variant="outline-light"
                                onClick={logOut}
                            >
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline-light"
                            onClick={() => navigate(LOGIN_ROUTE)}
                        >
                            Войти
                        </Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
});

export default NavBar;
