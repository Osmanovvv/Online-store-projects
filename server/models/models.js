const sequelize = require('../db')
const {DataTypes} = require('sequelize')


// sequelize.sync({ force: true })
//     .then(() => {
//         console.log("Все таблицы пересозданы!");
//     })
//     .catch(err => {
//         console.error("Ошибка при пересоздании базы данных:", err);
//     });

// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("Таблицы успешно синхронизированы!");
//   })
//   .catch(err => {
//     console.error("Ошибка при синхронизации: ", err);
//   });

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: { type: DataTypes.STRING, unique: true,},
    password: { type: DataTypes.STRING},
    role: { type: DataTypes.STRING, defaultValue: "USER"},
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
});


const Favorite = sequelize.define('favorite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
  });

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('basket_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1}, // Количество товаров, добавленных в корзину
})

const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    purchase_price: { type: DataTypes.INTEGER, allowNull: false },
    sale_price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    img: { type: DataTypes.STRING, allowNull: false },
    quantity_in_stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    
    // 🔽 Добавляем недостающие поля
    typeId: { type: DataTypes.INTEGER },
    brandId: { type: DataTypes.INTEGER }
});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const DeviceInfo = sequelize.define('device_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const BusinessAnalysis = sequelize.define('business_analysis', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    period: { type: DataTypes.STRING, allowNull: false },  // Период анализа
    total_revenue: { type: DataTypes.INTEGER, allowNull: false },  // Выручка
    total_margin: { type: DataTypes.INTEGER, allowNull: false },  // Маржа
    total_items_sold: { type: DataTypes.INTEGER, allowNull: false },  // Количество проданных товаров
    total_items_purchased: { type: DataTypes.INTEGER, allowNull: false },  // Количество купленных товаров
});

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Order = sequelize.define('order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  });
  
const OrderDevice = sequelize.define('order_device', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

Order.belongsToMany(Device, { through: OrderDevice });
Device.belongsToMany(Order, { through: OrderDevice });

Order.hasMany(OrderDevice);
OrderDevice.belongsTo(Order);

Device.hasMany(OrderDevice);
OrderDevice.belongsTo(Device);

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as: 'info'})
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

BusinessAnalysis.belongsTo(Device);  // Каждый бизнес-анализ связан с одним устройством
Device.hasMany(BusinessAnalysis);    // У одного устройства может быть несколько бизнес-анализов

User.hasMany(Favorite);
Favorite.belongsTo(User);

Device.hasMany(Favorite);
Favorite.belongsTo(Device);

User.hasMany(Order);
Order.belongsTo(User);

Device.hasMany(Order);
Order.belongsTo(Device);



module.exports = {
    User,
    Favorite,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo,
    BusinessAnalysis,
    Order,
    OrderDevice,
}