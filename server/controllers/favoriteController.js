const { Favorite, Device } = require('../models/models');

class FavoriteController {
  async add(req, res) {
    const { deviceId } = req.body;
    const userId = req.user.id;
    const favorite = await Favorite.create({ userId, deviceId });
    return res.json(favorite);
  }

  async getAll(req, res) {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({ where: { userId }, include: [{ model: Device }], });
    return res.json(favorites);
  }

  async remove(req, res) {
    const { deviceId } = req.body;
    const userId = req.user.id;
    await Favorite.destroy({ where: { userId, deviceId } });
    return res.json({ message: "Удалено из избранного" });
  }
}

module.exports = new FavoriteController();
