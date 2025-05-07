const Router = require('express');
const router = new Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, favoriteController.add);
router.get('/', authMiddleware, favoriteController.getAll);
router.delete('/', authMiddleware, favoriteController.remove);

module.exports = router;
