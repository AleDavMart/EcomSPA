CREATE DATABASE onlineshop;

CREATE TABLE products(
    product_id SERIAL PRIMARY KEY, --- SERIAL increase the PM key to ensure uniqueness
    pname VARCHAR(50), 
    price INT,
    p_inventory INT
);