const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// Создание нового заказа
router.post('/', authMiddleware, orderController.create);

// Получить все заказы (только для админа/менеджера)
router.get('/', checkRoleMiddleware(['ADMIN', 'MANAGER']), orderController.getAll);

// Получить заказы пользователя (до /:id!)
router.get('/user/:userId', authMiddleware, orderController.getUserOrders);

// Получить один заказ по id
router.get('/:id', authMiddleware, orderController.getOne);

// Обновление статуса заказа
router.put('/:id', checkRoleMiddleware(['ADMIN', 'MANAGER']), orderController.updateStatus);

// Удаление заказа
router.delete('/:id', checkRoleMiddleware(['ADMIN']), orderController.delete);

module.exports = router;
