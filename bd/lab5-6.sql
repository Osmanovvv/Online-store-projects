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
    IF v_price < 60000 THEN
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
-- Этот запрос создает процедуру DecreaseDiscounts, которая уменьшает скидку на все объекты недвижимости в таблице RealEstate. 
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
