const Router = require('express');
const router = new Router();
const DashboardController = require('../controllers/dashboardController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/stats', checkRole('ADMIN'), DashboardController.getStats);
router.get('/report', checkRole('ADMIN'), DashboardController.getUserReport);  // Новый маршрут для отчета
router.get('/roles-report', checkRole('ADMIN'), DashboardController.getRolesReport);    

module.exports = router;
