DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ips;
CREATE TABLE users (
    id CHAR(36),
    username VARCHAR(15),
    password CHAR(64),
    balance INT,
    session_id CHAR(36),
    session_expire LONG,
    allow_collect LONG,
    birth_time LONG,
    is_admin BOOLEAN,
    PRIMARY KEY (id)
);
CREATE TABLE ips (
    id VARCHAR(255),
    username VARCHAR(15),
    ip CHAR(15)
);