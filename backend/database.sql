-- Zaiqa Food Ordering — Database Schema
-- Import this file into MySQL/MariaDB (e.g. via phpMyAdmin in XAMPP/Laragon)

CREATE DATABASE IF NOT EXISTS zaiqa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zaiqa_db;

-- ---------------------------------------------------------------
-- Categories (e.g. Karahi, BBQ, Fast Food, Desserts, Drinks)
-- ---------------------------------------------------------------
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  sort_order INT DEFAULT 0
);

-- ---------------------------------------------------------------
-- Menu items
-- ---------------------------------------------------------------
CREATE TABLE menu_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(400) DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500) DEFAULT '',
  is_veg TINYINT(1) DEFAULT 0,
  is_available TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_number INT NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address VARCHAR(400) DEFAULT '',
  order_type ENUM('delivery','pickup') DEFAULT 'delivery',
  status ENUM('pending','preparing','on_the_way','completed','cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes VARCHAR(300) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- Order items (line items — snapshot of price/name at order time)
-- ---------------------------------------------------------------
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  menu_item_id INT,
  item_name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Admins (for the admin panel)
-- ---------------------------------------------------------------
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  token VARCHAR(255) DEFAULT NULL,
  token_expires_at DATETIME DEFAULT NULL
);

-- Default admin login -> username: admin / password: admin123
-- (hash generated with PHP password_hash('admin123', PASSWORD_BCRYPT))
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ---------------------------------------------------------------
-- Seed categories
-- ---------------------------------------------------------------
INSERT INTO categories (name, slug, sort_order) VALUES
('Karahi & Curry', 'karahi-curry', 1),
('BBQ & Grill', 'bbq-grill', 2),
('Fast Food', 'fast-food', 3),
('Rice & Biryani', 'rice-biryani', 4),
('Drinks', 'drinks', 5),
('Desserts', 'desserts', 6);

-- ---------------------------------------------------------------
-- Seed menu items
-- ---------------------------------------------------------------
INSERT INTO menu_items (category_id, name, description, price, image_url, is_veg, is_available) VALUES
(1, 'Chicken Karahi (Half)', 'Tomato-based karahi cooked with ginger, green chili and fresh coriander', 950.00, '', 0, 1),
(1, 'Mutton Karahi (Half)', 'Slow-cooked mutton karahi, rich and spiced', 1450.00, '', 0, 1),
(1, 'Daal Mash', 'Creamy black lentils tempered with garlic and cumin', 350.00, '', 1, 1),
(1, 'Paneer Butter Masala', 'Cottage cheese in a velvety tomato-butter gravy', 600.00, '', 1, 1),
(2, 'Seekh Kebab (6 pcs)', 'Char-grilled minced beef skewers with house spice blend', 550.00, '', 0, 1),
(2, 'Chicken Tikka (Full)', 'Marinated overnight, grilled on charcoal', 700.00, '', 0, 1),
(2, 'Malai Boti (Half)', 'Creamy, mildly-spiced grilled chicken', 650.00, '', 0, 1),
(3, 'Zinger Burger', 'Crispy fried chicken fillet, house sauce, fresh lettuce', 450.00, '', 0, 1),
(3, 'Loaded Fries', 'Fries topped with cheese sauce, jalapenos and tikka bits', 500.00, '', 0, 1),
(3, 'Chicken Roll', 'Paratha roll with grilled chicken, chutney and salad', 300.00, '', 0, 1),
(4, 'Chicken Biryani (Plate)', 'Fragrant basmati rice layered with spiced chicken', 400.00, '', 0, 1),
(4, 'Mutton Pulao (Plate)', 'Slow-cooked rice with tender mutton and whole spices', 550.00, '', 0, 1),
(5, 'Kashmiri Chai', 'Pink tea served warm with a hint of cardamom', 200.00, '', 1, 1),
(5, 'Fresh Lime Soda', 'Sweet, salty or mixed — served chilled', 150.00, '', 1, 1),
(6, 'Gulab Jamun (2 pcs)', 'Soft milk dumplings soaked in rose-cardamom syrup', 180.00, '', 1, 1),
(6, 'Kheer', 'Traditional rice pudding with pistachio and saffron', 220.00, '', 1, 1);
