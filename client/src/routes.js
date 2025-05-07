import Admin from './pages/Admin';
import Basket from './pages/BasketPage';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import DevicePage from './pages/DevicePage';
import ProfilePage from './pages/ProfilePage';
import Manager from './pages/Manager';

import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, PROFILE_ROUTE, MANAGER_ROUTE } from './utils/consts';

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin,
        requireRole: 'ADMIN'
    },
    {
        path: MANAGER_ROUTE,
        Component: Manager,
        requireRole: 'MANAGER'
    },
    {
        path: BASKET_ROUTE,
        Component: Basket,
        requireRole: 'USER'
    },
    {
        path: PROFILE_ROUTE,
        Component: ProfilePage,
        requireRole: 'USER'
    },
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: DevicePage
    },
];