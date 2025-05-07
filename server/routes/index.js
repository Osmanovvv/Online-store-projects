const Router = require('express');
const router = new Router();

const deviceRouter = require('./deviceRouter');
const userRouter = require('./userRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const favoriteRouter = require('./favoriteRouter');
const basketRouter = require('./basketRouter');
const dashboardRouter = require('./dashboardRouter');
const orderRouter = require('./orderRouter');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/favorite', favoriteRouter);
router.use('/basket', basketRouter);
router.use('/admin', dashboardRouter); // 👈 это /admin/stats
router.use('/manager', orderRouter); // 👈 это /admin/stats

module.exports = router;
