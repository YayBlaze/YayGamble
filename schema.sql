DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id VARCHAR(36),
    username VARCHAR(15),
    password VARCHAR(15),
    balance INT,
    session_id VARCHAR(26),
    session_expire LONG,
    allow_collect LONG,
    birth_time LONG,
    is_admin BOOLEAN,
    PRIMARY KEY (id)
);
CREATE TABLE ips (
    id VARCHAR(255),
    username VARCHAR(15),
    ip CHAR(15),
    PRIMARY KEY (id)
);