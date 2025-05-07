const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);  

// Только админ
router.get('/all', checkRole('ADMIN'), userController.getAllUsers);
router.patch('/role/:id', checkRole('ADMIN'), userController.updateRole);
router.delete('/:id', checkRole('ADMIN'), userController.deleteUser);

// router.get('/stats', checkRole('ADMIN'), userController.getStats);
router.get('/stats', checkRole('ADMIN'), dashboardController.getStats);

module.exports = router;
