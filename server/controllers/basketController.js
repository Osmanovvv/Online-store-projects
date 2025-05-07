const { Basket, BasketDevice } = require('../models/models');

class BasketController {
  async add(req, res) {
    const { deviceId } = req.body;
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });
    const basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId });
    return res.json(basketDevice);
  }
}
module.exports = new BasketController();
