DELIMITER $$
DROP PROCEDURE IF EXISTS `create_account` $$
CREATE PROCEDURE `create_account`(IN `username` VARCHAR(255), IN `password` VARCHAR(255),
                                  IN `email` VARCHAR(255),
                                  IN `full_name` VARCHAR(255), IN `phone` VARCHAR(255),
                                  IN `avatar` VARCHAR(255), IN `role` VARCHAR(255),
                                  OUT `account_id` INT
)
BEGIN
    INSERT INTO accounts (username, password, email, full_name, phone, avatar)
    VALUES (username, password, email, full_name, phone, avatar);
    SET @account_id = LAST_INSERT_ID();
    INSERT INTO account_roles (account_id, role_id)
    VALUES (@account_id, (SELECT id FROM roles WHERE name = role));
    SET account_id = @account_id;
END;
$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `create_driver` $$
CREATE PROCEDURE `create_driver`(IN `username` VARCHAR(255), IN `password` VARCHAR(255),
                                 IN `email` VARCHAR(255),
                                 IN `full_name` VARCHAR(255), IN `phone` VARCHAR(255),
                                 IN `avatar` VARCHAR(255),
                                 IN `status` INT,
                                 IN `birthday` DATE, IN `address` VARCHAR(255),
                                 IN `location_address` VARCHAR(255),
                                 IN `location_longitude` FLOAT,
                                 IN `location_latitude` FLOAT
)
BEGIN
    DECLARE account_id INT;
    START TRANSACTION;
    CALL create_account(username, password, email, full_name, phone, avatar, 'driver', account_id);
    INSERT INTO drivers (id, birthday, address, status, location_address, location_longitude, location_latitude)
    VALUES (account_id, birthday, address, status, location_address, location_longitude, location_latitude);
    COMMIT;
END;
$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `create_user` $$
CREATE PROCEDURE `create_user`(IN `username` VARCHAR(255), IN `password` VARCHAR(255),
                               IN `email` VARCHAR(255),
                               IN `full_name` VARCHAR(255), IN `phone` VARCHAR(255),
                               IN `avatar` VARCHAR(255)
)
BEGIN
    DECLARE account_id INT;
    START TRANSACTION;
    CALL create_account(username, password, email, full_name, phone, avatar, 'user', account_id);
    INSERT INTO users (id)
    VALUES (account_id);
    COMMIT;
END;
$$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `generate_driver_data` $$
CREATE PROCEDURE generate_driver_data()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE username VARCHAR(255);
    DECLARE p_password VARCHAR(255);
    DECLARE email VARCHAR(255);
    DECLARE fullName VARCHAR(255);
    DECLARE phone VARCHAR(20);
    DECLARE birthday DATE;
    DECLARE avatar VARCHAR(255);
    DECLARE status INT;
    DECLARE address VARCHAR(255);
    DECLARE location_address VARCHAR(255);
    DECLARE location_longitude float;
    DECLARE location_latitude float;

    WHILE i <= 300
        DO
            -- Random data
            SET username = CONCAT('driver', i);
            SET p_password = CONCAT('password', i);
            SET email = CONCAT('driver', i, '@gmail.com');
            SET fullName = CONCAT('Full Name ', i);
            SET phone = CONCAT('0', LPAD(FLOOR(RAND() * 999999999) + 1, 9, '3')); -- Random phone number
            SET birthday =
                    DATE_ADD('1970-01-01', INTERVAL FLOOR(RAND() * 365 * 50) DAY); -- Random birthday within 50 years
            SET avatar = CONCAT('https://randomavatar.com/avatar/', i);
            SET status = ROUND(RAND() * 2) + 1;
            SET address = CONCAT('Address ', i);
            SET location_address = CONCAT('Location Address ', i);
            SET location_longitude = 105.7 + (RAND() * (106 - 105.7)); -- Random longitude within range
            SET location_latitude = 20.85 + (RAND() * (21.15 - 20.85));
            -- Random latitude within range

            -- Insert data
            CALL create_driver(username, p_password, email, fullName, phone, avatar, status, birthday, address,
                               location_address,
                               location_longitude, location_latitude);

            SET i = i + 1;
        END WHILE;
END $$
DELIMITER ;

# call generate_driver_data();