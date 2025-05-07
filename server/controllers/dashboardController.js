const { User, Order, Device } = require('../models/models');
const { Op } = require('sequelize');

class DashboardController {
  async getStats(req, res) {
    try {
      const userCount = await User.count();
      const deviceCount = await Order.count();
      const brandCount = await Device.count();

      return res.json({
        usersCount: userCount,
        ordersCount: deviceCount,
        totalQuantity: brandCount
      });
    } catch (e) {
      console.error('Ошибка при получении статистики:', e);
      return res.status(500).json({ message: 'Ошибка сервера' });
    }
  } 

  async getUserReport(req, res) {
    try {
      const { from, to, start, end } = req.query;

      const where = {};
      if (from && to) {
        where.createdAt = {
          [Op.between]: [new Date(from), new Date(to)],
        };
      }

      const totalUsers = await User.count();
      const totalRegistrations = await User.count({ where });
      // const activeUsers = await User.count({ where: { active: true } });

      const newUsers = await User.count({
        where: {
          createdAt: {
            [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      });

      res.json({
        date: new Date().toLocaleString('ru-RU'),
        period: start && end ? `${start} — ${end}` : 'за всё время',
        totalUsers,
        totalRegistrations,
        // activeUsers,
        // newUsers,
      });
    } catch (error) {
      console.error('Ошибка при получении отчета:', error);
      res.status(500).send('Ошибка сервера');
    }
  }

  async getRolesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
  
      const whereClause = {};
      if (startDate && endDate) {
        whereClause.createdAt = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }
  
      const users = await User.findAll({ where: whereClause });
  
      const roleCounts = {
        user: 0,
        manager: 0,
        admin: 0
      };
  
      users.forEach(user => {
        const role = user.role || 'user';
        if (roleCounts[role] !== undefined) {
          roleCounts[role]++;
        }
      });
  
      res.json({
        date: new Date().toLocaleString('ru-RU'),
        period: startDate && endDate ? `${startDate} — ${endDate}` : 'за всё время',
        total: users.length,
        ...roleCounts
      });
  
    } catch (error) {
      console.error('Ошибка при получении отчета по ролям:', error);
      res.status(500).send('Ошибка сервера');
    }
  }
}



module.exports = new DashboardController();
