-- Лаб 5-6
-- 1
 -- Представление 1 Список смартфонов с их брендами
CREATE VIEW DevicesWithBrands AS
SELECT 
    d.id AS device_id,
    d.name AS device_name,
    d.sale_price,
    b.name AS brand_name
FROM 
    device d
JOIN 
    brand b ON d."brandId" = b.id;

		
 -- Представление 2 Список пользователей и товаров в их корзинах
CREATE OR REPLACE VIEW UserBasketDevices AS
SELECT 
    u.id AS user_id,
    u.email,
    d.id AS device_id,
    d.name AS device_name,
    d.sale_price,
    b.name AS brand_name
FROM 
    basket bs
JOIN 
    "user" u ON bs."userId" = u.id
JOIN 
    basket_device bd ON bs.id = bd."basketId"
JOIN 
    device d ON bd."deviceId" = d.id
JOIN 
    brand b ON d."brandId" = b.id;


 -- Представление 3 Список устройств с их ценой и характеристиками (память, экран, камера и т.д.).
CREATE VIEW DevicesWithInfo AS
SELECT d.id, 
       d.name, 
       d.purchase_price, 
       d.sale_price, 
       di.title AS device_info_title, 
       di.description AS device_info_description
FROM device d
JOIN device_info di ON di."deviceId" = d.id;


-- Представление 4: Список клиентов с общей суммой, потраченной на смартфоны
CREATE VIEW CustomersTotalSpent AS
SELECT 
    u.id AS "userId",
    u.email,
    SUM(d.sale_price) AS total_spent
FROM 
    "user" u
JOIN 
    basket b ON u.id = b."userId"
JOIN 
    basket_device bd ON b.id = bd."basketId"
JOIN 
    device d ON bd."deviceId" = d.id
GROUP BY 
    u.id, u.email;


  -- Представление 5 Список смартфонов с их ценой и средней ценой по бренду
CREATE VIEW DevicesWithAvgBrandPrice AS
SELECT 
    d.id AS "deviceId",
    d.name AS device_name,
    b.name AS brand_name,
    d.sale_price,
    (
        SELECT AVG(sale_price) 
        FROM device 
        WHERE "brandId" = d."brandId"
    ) AS avg_brand_price
FROM 
    device d
JOIN 
    brand b ON d."brandId" = b.id;


-- 2
SELECT * FROM DevicesWithBrands;
SELECT * FROM UserBasketDevices;
SELECT * FROM DevicesWithInfo;
SELECT * FROM CustomersTotalSpent;
SELECT * FROM DevicesWithAvgBrandPrice;

-- 3
UPDATE DevicesWithInfo
SET sale_price = 70000
WHERE id = 1;


-- 4
DROP VIEW DevicesWithBrands;
DROP VIEW UserBasketDevices;
DROP VIEW DevicesWithInfo;
DROP VIEW CustomersTotalSpent;
DROP VIEW DevicesWithAvgBrandPrice;





-- Лаб 7
-- 1
-- Объявление переменных и вывод
DO $$ 
DECLARE 
    device_id INT := 101;
    device_name TEXT := 'iPhone 14 Pro';
    sale_price NUMERIC := 999.99;
BEGIN
    -- Вывод значений переменных через RAISE NOTICE
    RAISE NOTICE 'Device ID: %, Device Name: %, Sale Price: %', device_id, device_name, sale_price;
END $$;


-- 2
-- Создал процедуру, которая принимает ID устройства и увеличивает его цену:
-- если текущая цена меньше 50 000, она увеличивается на 10%;
-- в противном случае цена увеличивается на 5%.
CREATE OR REPLACE PROCEDURE update_device_price(p_device_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_price NUMERIC;
BEGIN
    -- Получаем текущую цену продажи устройства
    SELECT sale_price INTO v_price FROM device WHERE id = p_device_id;

    -- Увеличиваем цену на 10% если меньше 60000, иначе на 5%
    IF v_price < 70000 THEN
        UPDATE device SET sale_price = sale_price * 1.10 WHERE id = p_device_id;
    ELSE
        UPDATE device SET sale_price = sale_price * 1.05 WHERE id = p_device_id;
    END IF;
END;
$$;

CALL update_device_price(1);  -- обновит цену продажи у iPhone 12

SELECT * FROM device WHERE id = 1;


-- 3
-- Пусть процедура будет увеличивать sale_price всех устройств бренда с brandId = 1 на 5%, пока средняя sale_price этого бренда не превысит, скажем, 70 000.
DO $$
DECLARE
    avg_price NUMERIC;
BEGIN
    -- Получаем начальное среднее значение цены
    SELECT AVG(sale_price) INTO avg_price FROM device WHERE "brandId" = 2;

    -- Цикл: увеличиваем цены на 5%, пока среднее значение не станет выше 70000
    WHILE avg_price <= 70000 LOOP
        UPDATE device
        SET sale_price = sale_price * 1.05
        WHERE "brandId" = 2;

        -- Пересчитываем среднюю цену
        SELECT AVG(sale_price) INTO avg_price FROM device WHERE "brandId" = 2;
    END LOOP;
END $$;

SELECT id, name, sale_price FROM device WHERE "brandId" = 2;


-- 4
-- Скидка уменьшается на 1% от текущей величины скидки (в денежном выражении) до тех пор, пока средняя скидка не станет меньше 5% от средней цены объектов недвижимости. 
-- Процедура использует цикл LOOP (аналог цикла REPEAT в других СУБД) для выполнения операции.
CREATE OR REPLACE PROCEDURE DecreaseDiscounts()
AS
$$
DECLARE
    v_avg_discount DECIMAL(10,2);
    v_avg_price DECIMAL(10,2);
    v_maxiterations INT DEFAULT 100;  -- Максимальное количество итераций для предотвращения бесконечного цикла
    v_counter INT DEFAULT 0;  -- Счётчик итераций
BEGIN
    -- Вычисляем среднюю скидку и среднюю цену
    SELECT AVG(sale_price), AVG(purchase_price) INTO v_avg_discount, v_avg_price FROM device;
    
    -- Начинаем цикл, который будет работать до тех пор, пока средняя скидка не станет меньше 5% от средней цены или не достигнем максимального количества итераций
    LOOP
        -- Уменьшаем цену со скидкой на 1%
        UPDATE device 
        SET sale_price = sale_price - (sale_price * 0.01)
        WHERE sale_price > 0;
        
        -- Пересчитываем среднюю скидку и среднюю цену
        SELECT AVG(sale_price), AVG(purchase_price) INTO v_avg_discount, v_avg_price FROM device;
        
        -- Увеличиваем счётчик итераций
        v_counter := v_counter + 1;
        
        -- Проверяем условия выхода из цикла
        EXIT WHEN (v_avg_discount / v_avg_price * 100) < 5 OR v_counter >= v_maxiterations;
    END LOOP;
    
    -- Вывод количества итераций в журнал
    RAISE NOTICE 'Iterations: %', v_counter;
END;
$$
LANGUAGE plpgsql;


CALL DecreaseDiscounts();

SELECT AVG(sale_price), AVG(purchase_price) FROM device;



-- 5
-- Создайте процедуру, которая увеличивает цену продажи (sale_price) всех смартфонов бренда Apple на 5%, до тех пор, 
-- пока средняя наценка (разница между sale_price и purchase_price) не превысит 7000. Используйте цикл LOOP и оператор LEAVE.

CREATE OR REPLACE PROCEDURE IncreaseMarkupUntilThreshold()
AS
$$
DECLARE
    v_avg_markup DECIMAL(10,2);
    v_max_iterations INT DEFAULT 100;
    v_counter INT DEFAULT 0;
BEGIN
    -- Получаем начальную среднюю наценку для бренда Apple
    SELECT AVG(d.sale_price - d.purchase_price)
    INTO v_avg_markup
    FROM device d
    JOIN brand b ON d."brandId" = b.id
    WHERE b.name = 'Apple';

    -- Цикл увеличения цены продажи, пока средняя наценка < 3000 или не превышен лимит итераций
    LOOP
        EXIT WHEN v_avg_markup >= 3000 OR v_counter >= v_max_iterations;

        -- Увеличиваем цену продажи на 5%
        UPDATE device
        SET sale_price = sale_price * 1.05
        FROM brand
        WHERE device."brandId" = brand.id
          AND brand.name = 'Apple';

        -- Пересчитываем среднюю наценку
        SELECT AVG(d.sale_price - d.purchase_price)
        INTO v_avg_markup
        FROM device d
        JOIN brand b ON d."brandId" = b.id
        WHERE b.name = 'Apple';

        -- Увеличиваем счётчик
        v_counter := v_counter + 1;
    END LOOP;

    -- Выводим в журнал количество итераций
    RAISE NOTICE 'Iterations: %', v_counter;
END;
$$
LANGUAGE plpgsql;




-- До вызова:
SELECT AVG(d.sale_price - d.purchase_price) AS avg_markup
FROM device d
JOIN brand b ON d."brandId" = b.id
WHERE b.name = 'Apple';


-- Вызов процедуры:
CALL IncreaseMarkupUntilThreshold();

-- После вызова:
SELECT AVG(d.sale_price - d.purchase_price) AS avg_markup
FROM device d
JOIN brand b ON d."brandId" = b.id
WHERE b.name = 'Apple';


select * from device





-- лаб 8 - 9
-- Триггер: При обнулении количества товара на складе автоматически удаляются все записи этого устройства из корзин пользователей

CREATE OR REPLACE FUNCTION delete_from_basket_when_stock_empty()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.quantity_in_stock = 0 THEN
        DELETE FROM "basket_device"
        WHERE "deviceId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_delete_from_basket_when_stock_empty
AFTER UPDATE ON "device"
FOR EACH ROW
EXECUTE FUNCTION delete_from_basket_when_stock_empty();


SELECT * FROM "basket_device" WHERE "deviceId" = 5;

-- Уменьшаем количество смартфона до 0
UPDATE "device"	
SET quantity_in_stock = 0
WHERE id = 5;

-- Проверяем, остались ли такие товары в корзинах
SELECT * FROM "basket_device" WHERE "deviceId" = 5;


DROP TRIGGER IF EXISTS trigger_delete_from_basket_on_stock_empty ON device;
DROP FUNCTION IF EXISTS delete_from_basket_when_out_of_stock;


ALTER TABLE device 
    ALTER COLUMN quantity_in_stock SET NOT NULL,
    ALTER COLUMN quantity_in_stock SET DEFAULT 0,
    ALTER COLUMN quantity_in_stock TYPE INTEGER;



-- Триггер проверяет, что при добsавлении нового пользователя в таблицу "user"
-- его возраст больше или равен 18 лет, исходя из даты в поле "createdAt".
-- Если возраст меньше 18 лет, вставка будет заблокирована с ошибкой.

-- Функция для проверки, что пользователю больше 18 лет
CREATE OR REPLACE FUNCTION check_user_age()
RETURNS TRIGGER AS $$
BEGIN
  -- Проверяем возраст по дате рождения
  IF (DATE_PART('year', AGE(NEW.date_of_birth)) < 18) THEN
    RAISE EXCEPTION 'Пользователь должен быть старше 18 лет';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для проверки перед вставкой пользователя
CREATE TRIGGER trigger_check_user_age
BEFORE INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION check_user_age();


-- Попытка добавить пользователя младше 18 лет (будет ошибка)
INSERT INTO "user" (email, password, role, "createdAt", "updatedAt", date_of_birth) 
VALUES ('younguser@example.com', 'password123', 'USER', NOW(), NOW(), '2010-01-01');

-- Попытка добавить взрослого пользователя (будет успех)
INSERT INTO "user" (email, password, role, "createdAt", "updatedAt", date_of_birth) 
VALUES ('adultuser@example.com', 'password123', 'USER', NOW(), NOW(), '1990-01-01');




-- Триггер автоматически вычисляет скидку 5% от цены продажи (sale_price) при добавлении нового смартфона.

CREATE OR REPLACE FUNCTION calculate_device_discount()
RETURNS TRIGGER AS $$
BEGIN
  NEW.discount = NEW.sale_price * 0.05;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_device_discount
BEFORE INSERT ON device
FOR EACH ROW
EXECUTE FUNCTION calculate_device_discount();

-- Добавляем новое устройство
INSERT INTO device (id, name, purchase_price, sale_price, rating, img, discount, "brandId", "typeId", "createdAt", "updatedAt")
VALUES (100, 'Galaxy S210', 800, 10000, 5, 'galaxy-s22.jpg', 0, 1, 1, NOW(), NOW());

-- Проверяем
SELECT * FROM device WHERE name = 'Galaxy S210';




-- Триггер для автоматического расчета комиссии:
CREATE OR REPLACE FUNCTION calculate_device_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Предположим, комиссия всегда 5%
  NEW.commission = NEW.sale_price * 5 / 100;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_device_commission
BEFORE INSERT ON device
FOR EACH ROW
EXECUTE FUNCTION calculate_device_commission();


-- Добавляем новое устройство
INSERT INTO device (id, name, purchase_price, sale_price, rating, img, discount, commission, "brandId", "typeId", "createdAt", "updatedAt")
VALUES (16, 'iPhone 15', 800, 1200, 5, 'iphone15.jpg', 0, 0, 1, 1, NOW(), NOW());

-- Смотрим, что получилось
SELECT id, name, sale_price, commission
FROM device
WHERE id = 16;



-- Задание 5. Триггер на проверку уникальности номера телефона в таблице user
CREATE OR REPLACE FUNCTION check_unique_user_phone()
RETURNS TRIGGER AS $$
BEGIN
  -- Проверка: если существует другой клиент с таким же номером
  IF EXISTS (SELECT 1 FROM "user" WHERE phone = NEW.phone) THEN
    RAISE EXCEPTION 'Номер телефона не уникален';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_unique_user_phone
BEFORE INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION check_unique_user_phone();



-- Успешная вставка пользователя с уникальным номером
INSERT INTO "user" (email, password, role, phone, "createdAt", "updatedAt")
VALUES ('ivanov1@example.com', 'password123', 'USER', '1234567891', NOW(), NOW());

-- Попытка вставить другого пользователя с таким же номером телефона
INSERT INTO "user" (email, password, role, phone, "createdAt", "updatedAt")
VALUES ('petrova@example.com', 'password123', 'USER', '1234567891', NOW(), NOW());





-- лаб 10-11
 -- Задание 1. Генерация электронной почты для клиентов
 SELECT
  id,
  first_name,
  last_name,
  CONCAT(LOWER(last_name), '.', LOWER(first_name), '@example.com') AS generated_email
FROM "user";

select * from "user"


 -- Задание 2. Найти клиентов старше 30 лет и показать их возраст
 SELECT
  id,
  email,
  DATE_PART('year', AGE(date_of_birth)) AS age
FROM "user"
WHERE DATE_PART('year', AGE(date_of_birth)) > 30;



-- Задание 3: Объединение имени и фамилии пользователя
SELECT
	id,
	CONCAT(first_name, ' ', last_name) AS full_name
FROM "user";


-- Задание 4: Преобразование телефона пользователя в единый формат
SELECT
	id,
	phone,
	CONCAT('+7', REPLACE(phone, '-', '')) AS formatted_phone
FROM "user";
	

-- Задание 5: Формирование имени пользователя в формате И. Фамилия
SELECT
	id,
	CONCAT(
	LEFT(first_name, 1), '. ',
	last_name
	) AS formatted_name
FROM "user";




-- 12-13
--  Задание 1: Расчет стоимости смартфона со скидкой
CREATE OR REPLACE FUNCTION CalculateDiscountedPrice( price DECIMAL(10, 2), discount DECIMAL(5, 2) )
RETURNS DECIMAL(10, 2)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN price * (1 - discount / 100);
END;
$$;

-- Допустим, смартфон стоит 50000 руб, а скидка 10% (0.10)
SELECT id, name, sale_price, discount,
       CalculateDiscountedPrice(sale_price, discount) AS discounted_price
FROM device;



-- Задание 2: Определение категории смартфона по цене
CREATE OR REPLACE FUNCTION GetDeviceCategory(price DECIMAL(10, 2))
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
  category VARCHAR(20);
BEGIN
  IF price < 30000 THEN
    category := 'Бюджетный';
  ELSIF price BETWEEN 30000 AND 70000 THEN
    category := 'Средний';
  ELSE
    category := 'Премиум';
  END IF;
  RETURN category;
END;
$$;

SELECT id, name, sale_price,
       GetDeviceCategory(sale_price) AS category
 FROM "device";          




-- Задание 3: Вычисление возраста пользователя
CREATE OR REPLACE FUNCTION CalculateAge(date_of_birth DATE)
RETURNS INT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN DATE_PART('year', AGE(date_of_birth));
END;
$$;

SELECT id, email, date_of_birth,
       CalculateAge(date_of_birth) AS age
FROM "user";



-- Задание 4: Расчет комиссии интернет-магазина
CREATE OR REPLACE FUNCTION CalculateCommission(price DECIMAL(10, 2), commission_rate DECIMAL(5, 2))
RETURNS DECIM  AL(10, 2) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN price * commission_rate / 100;
END;
$$;

SELECT id, name, sale_price,
       CalculateCommission(sale_price, 5) AS commission -- 5% фиксировано
FROM device;



-- Задание 5: Расчет средней цены смартфона по бренду
CREATE OR REPLACE FUNCTION GetAveragePriceByBrand(brand_name VARCHAR(50))
RETURNS DECIMAL(10, 2)
LANGUAGE plpgsql
AS $$
DECLARE
  avg_price DECIMAL(10, 2);
BEGIN
  SELECT AVG(sale_price) INTO avg_price
  FROM device
  WHERE "brandId" = (SELECT id FROM brand WHERE name = brand_name);
  
  RETURN avg_price;
END;
$$;

SELECT b.name AS brand_name,
       GetAveragePriceByBrand(b.name) AS avg_price
FROM brand b;



-- Задание 6: Количество заказов пользователя
CREATE OR REPLACE FUNCTION GetOrderCount(user_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  order_count INT;
BEGIN
  SELECT COUNT(*) INTO order_count
  FROM "order"
  WHERE "userId" = user_id;
  
  RETURN order_count;
END;
$$;

SELECT id, email,
       GetOrderCount(id) AS order_count
FROM "user";



select * from device


select * from 'user'



