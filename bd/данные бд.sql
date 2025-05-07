-- Заполнение таблицы brand
INSERT INTO brand (id, name, "createdAt", "updatedAt") VALUES
(1, 'Apple', NOW(), NOW()),
(2, 'Samsung', NOW(), NOW()),
(3, 'Xiaomi', NOW(), NOW()),
(4, 'Google', NOW(), NOW()),
(5, 'Huawei', NOW(), NOW()),
(6, 'OnePlus', NOW(), NOW()),
(7, 'Sony', NOW(), NOW()),
(8, 'LG', NOW(), NOW()),
(9, 'Motorola', NOW(), NOW()),
(10, 'Nokia', NOW(), NOW());

SELECT * FROM brand


-- Заполнение таблицы device
-- TRUNCATE TABLE device RESTART IDENTITY CASCADE;

INSERT INTO device (id, name, purchase_price, sale_price, rating, img, quantity_in_stock, "createdAt", "updatedAt", "brandId")
VALUES
  (1, 'iPhone 12', 56000, 64000, 4.8, 'iphone12.jpg', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  (2, 'Samsung Galaxy S21', 60000, 64000, 4.7, 's21.jpg', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  (3, 'Xiaomi Mi 11', 48000, 56000, 4.5, 'mi11.jpg', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  (4, 'Oppo Reno 6', 52000, 60000, 4.4, 'reno6.jpg', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  (5, 'Huawei P40', 64000, 72000, 4.6, 'p40.jpg', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  (6, 'OnePlus 9', 58500, 72000, 4.7, 'oneplus9.jpg', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  (7, 'Sony Xperia 1 II', 80000, 96000, 4.5, 'xperia1ii.jpg', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  (8, 'LG Velvet', 48000, 64000, 4.3, 'velvet.jpg', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  (9, 'Motorola Edge Plus', 76000, 80000, 4.6, 'edgeplus.jpg', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9),
  (10, 'Nokia 8.3 5G', 52000, 60000, 4.4, 'nokia83.jpg', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 10);

  SELECT * FROM device

UPDATE device
SET img = REPLACE(img, '.jpg', '.webp')
WHERE img LIKE '%.jpg';


  -- Заполнение таблицы device_info
  -- TRUNCATE TABLE device_info RESTART IDENTITY CASCADE;
  
INSERT INTO device_info ("title", "description", "createdAt", "updatedAt", "deviceId")
VALUES
  ('Экран', '6.1 дюйма, Super Retina XDR дисплей, разрешение 2532x1170 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Процессор', 'A14 Bionic', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Камера', '12 MP (широкий угол), 12 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Батарея', '2815 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),

  ('Экран', '6.2 дюйма, Dynamic AMOLED 2X, разрешение 3200x1440 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Процессор', 'Exynos 2100', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Камера', '64 MP (широкий угол), 12 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Батарея', '4000 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),

  ('Экран', '6.81 дюйма, AMOLED, разрешение 3200x1440 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Процессор', 'Snapdragon 888', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Камера', '108 MP (широкий угол), 13 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Батарея', '4600 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),

  ('Экран', '6.43 дюйма, AMOLED, разрешение 2400x1080 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Процессор', 'Snapdragon 765G', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Камера', '64 MP (широкий угол), 8 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Батарея', '4300 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4),

  -- Дополнительно добавим новые устройства
  ('Экран', '6.7 дюйма, AMOLED, разрешение 3200x1440 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Процессор', 'Kirin 990', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Камера', '50 MP (широкий угол), 12 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Батарея', '4200 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5),

  ('Экран', '6.5 дюйма, AMOLED, разрешение 2400x1080 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Процессор', 'Snapdragon 870', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Камера', '48 MP (широкий угол), 12 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Батарея', '4500 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),
  ('Память', '256 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6),

  ('Экран', '6.1 дюйма, OLED, разрешение 2340x1080 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Процессор', 'Snapdragon 865', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Камера', '12 MP (широкий угол), 8 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Батарея', '4000 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7),

  ('Экран', '6.8 дюйма, LCD, разрешение 2660x1440 пикселей', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Процессор', 'Dimensity 1000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Камера', '48 MP (широкий угол), 12 MP (ультраширокий угол)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Батарея', '5000 мАч', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
  ('Память', '128 ГБ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8);


    SELECT * FROM device_info

-- Заполнение таблицы user (пользователи)
-- INSERT INTO "user" (id, email, "createdAt", "updatedAt")
-- VALUES
--   (1, 'user1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (2, 'user2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (3, 'user3@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
--   (4, 'user4@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 	SELECT * FROM "user"


	-- Заполнение таблицы basket (корзины пользователей)
-- INSERT INTO basket (id, "createdAt", "updatedAt", "userId")
-- VALUES
--   (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
--   (2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
--   (3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
--   (4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4);

-- SELECT * FROM basket


-- Заполнение таблицы basket_device (связь корзины и устройств)
-- INSERT INTO basket_device (id, quantity, "createdAt", "updatedAt", "basketId", "deviceId")
-- VALUES
--   (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),  -- Корзина 1, iPhone 12
--   (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),  -- Корзина 1, Samsung Galaxy S21
--   (3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),  -- Корзина 2, Xiaomi Mi 11
--   (4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),  -- Корзина 2, Oppo Reno 6
--   (5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 1),  -- Корзина 3, iPhone 12
--   (6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),  -- Корзина 3, Huawei P40
--   (7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 6);  -- Корзина 4, OnePlus 9

-- SELECT * FROM basket_device



-- SELECT device.name AS device_name, sale_price, rating
-- FROM device
-- JOIN brand ON device."brandId" = brand.id
-- WHERE brand.name = 'Apple';


-- select * from device

INSERT INTO "order" ("userId", "deviceId", "quantity", "createdAt", "updatedAt")
VALUES
(1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


select * from "order"

SELECT COUNT(*) FROM "user";
SELECT COUNT(*) FROM "order";
SELECT SUM("quantity") FROM "order";


-- Добавляем колонку date_of_birth типа DATE
ALTER TABLE "user"
ADD COLUMN date_of_birth DATE NOT NULL DEFAULT '2000-01-01';

select * from "user"


-- Добавляем колонку discount в таблицу device
ALTER TABLE device
ADD COLUMN discount NUMERIC(12, 2) DEFAULT 0 NOT NULL;


-- Добавим новое поле commission в таблицу device, чтобы туда сохранять комиссию.
ALTER TABLE device ADD COLUMN commission DECIMAL(10, 2) DEFAULT 0;


ALTER TABLE "user"
ADD COLUMN phone VARCHAR(20);

ALTER TABLE device
ADD COLUMN commission DECIMAL(10,2);


ALTER TABLE "user"
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);



select * from device