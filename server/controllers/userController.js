const ApiError = require("../error/ApiError");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');
const { Op } = require('sequelize');
const { Device, Order } = require('../models/models');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
};

class UserController {
    async registration(req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'));
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ email, password: hashPassword });
        await Basket.create({ userId: user.id });

        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }

        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'));
        }

        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }

    async getAllUsers(req, res, next) {
        try {
          const { search, role } = req.query;
      
          let whereConditions = {};
      
          if (search) {
            whereConditions.email = { [Op.iLike]: `%${search}%` };
          }
      
          if (role && role !== 'ALL') {
            whereConditions.role = role;
          }
      
          const users = await User.findAll({
            where: whereConditions,
            attributes: ['id', 'email', 'role'],
            order: [['id', 'ASC']]
          });
      
          return res.json(users);
        } catch (e) {
          console.error('Ошибка в getAllUsers:', e.message); // <--- теперь покажет реальную причину в консоли
          return res.status(500).json({ message: 'Ошибка при получении пользователей', error: e.message }); // <--- и вернет текст ошибки
        }
      }      

    async updateRole(req, res) {
        const { id } = req.params;
        const { role } = req.body;

        if (!['ADMIN', 'MANAGER', 'USER'].includes(role)) {
            return res.status(400).json({ message: 'Недопустимая роль' });
        }

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            user.role = role;
            await user.save();
            return res.json({ message: 'Роль обновлена', user });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при обновлении роли' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await User.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            return res.json({ message: 'Пользователь удалён' });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при удалении пользователя' });
        }
    }

    async getStats(req, res) {
        try {
            const userCount = await User.count();
            const deviceCount = await Device.count();
            const orderCount = await Order.count();
    
            const topDeviceData = await Device.findOne({
                order: [['rating', 'DESC']] // рейтинг нужно чтобы был в Device
            });
            const topDevice = topDeviceData ? topDeviceData.name : 'Нет данных';
    
            return res.json({ userCount, deviceCount, orderCount, topDevice });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при получении статистики' });
        }
    }
    
}

module.exports = new UserController();
