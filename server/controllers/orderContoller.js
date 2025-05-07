const { Order, OrderDevice, Device, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async create(req, res, next) {
        try {
            const { userId, devices, totalPrice, address, phone } = req.body;
            
            if (!devices || !devices.length) {
                return next(ApiError.badRequest('Order must contain at least one device'));
            }

            // Create order
            const order = await Order.create({
                userId,
                totalPrice,
                address,
                phone,
                status: 'pending' // Default status
            });

            // Create order devices
            const orderDevices = await Promise.all(
                devices.map(async (item) => {
                    return await OrderDevice.create({
                        orderId: order.id,
                        deviceId: item.deviceId,
                        quantity: item.quantity,
                        price: item.price
                    });
                })
            );

            return res.json({ order, orderDevices });
        } catch (e) {
            next(ApiError.internal('Error creating order: ' + e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'name']
                    },
                    {
                        model: OrderDevice,
                        as: 'orderDevices',
                        include: [
                            {
                                model: Device,
                                as: 'device',
                                attributes: ['id', 'name', 'price', 'img']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            next(ApiError.internal('Error fetching orders: ' + e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findOne({
                where: { id },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'email', 'name']
                    },
                    {
                        model: OrderDevice,
                        as: 'orderDevices',
                        include: [
                            {
                                model: Device,
                                as: 'device',
                                attributes: ['id', 'name', 'price', 'img']
                            }
                        ]
                    }
                ]
            });
            
            if (!order) {
                return next(ApiError.notFound('Order not found'));
            }
            
            return res.json(order);
        } catch (e) {
            next(ApiError.internal('Error fetching order: ' + e.message));
        }
    }

    async getUserOrders(req, res, next) {
        try {
            const { userId } = req.params;
            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderDevice,
                        as: 'orderDevices',
                        include: [
                            {
                                model: Device,
                                as: 'device',
                                attributes: ['id', 'name', 'price', 'img']
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            return res.json(orders);
        } catch (e) {
            next(ApiError.internal('Error fetching user orders: ' + e.message));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
                return next(ApiError.badRequest('Invalid status value'));
            }
            
            const order = await Order.findOne({ where: { id } });
            
            if (!order) {
                return next(ApiError.notFound('Order not found'));
            }
            
            await order.update({ status });
            
            return res.json(order);
        } catch (e) {
            next(ApiError.internal('Error updating order status: ' + e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const order = await Order.findOne({ where: { id } });
            
            if (!order) {
                return next(ApiError.notFound('Order not found'));
            }
            
            // Delete related order devices first
            await OrderDevice.destroy({ where: { orderId: id } });
            
            // Delete the order
            await order.destroy();
            
            return res.json({ message: 'Order deleted successfully' });
        } catch (e) {
            next(ApiError.internal('Error deleting order: ' + e.message));
        }
    }
}

module.exports = new OrderController();