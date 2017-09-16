DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price  DECIMAL(10,2) NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL,
  department_name VARCHAR(100) NULL,
  over_head_costs INT NOT NULL,
  product_sales INT NOT NULL,
  PRIMARY KEY (department_id)
);