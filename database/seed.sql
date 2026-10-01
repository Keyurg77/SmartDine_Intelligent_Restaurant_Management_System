USE smartdine_db;

INSERT INTO users (full_name, email, password_hash, role)
VALUES
  ('SmartDine Admin', 'admin@smartdine.test', '$2b$10$examplehashforassessmentonlyadmin', 'admin'),
  ('Demo Customer', 'customer@smartdine.test', '$2b$10$examplehashforassessmentonlycustomer', 'customer');

INSERT INTO categories (name, description)
VALUES
  ('Starters', 'Small dishes and appetizers.'),
  ('Mains', 'Main meals served fresh from the kitchen.'),
  ('Drinks', 'Cold and hot beverages.'),
  ('Desserts', 'Sweet dishes and desserts.');

INSERT INTO menu_items (
  category_id,
  name,
  description,
  price,
  image_url,
  is_available,
  spice_level,
  created_by,
  updated_by
)
VALUES
  (1, 'Crispy Spring Rolls', 'Vegetable spring rolls with sweet chilli sauce.', 8.50, NULL, TRUE, 'mild', 1, 1),
  (1, 'Garlic Bread', 'Toasted bread with garlic butter and herbs.', 6.00, NULL, TRUE, 'none', 1, 1),
  (2, 'Grilled Chicken Bowl', 'Grilled chicken served with rice, salad, and house sauce.', 16.90, NULL, TRUE, 'medium', 1, 1),
  (2, 'Vegetable Pasta', 'Pasta with seasonal vegetables and tomato basil sauce.', 14.50, NULL, TRUE, 'none', 1, 1),
  (2, 'Spicy Beef Noodles', 'Noodles with beef strips, vegetables, and spicy sauce.', 15.90, NULL, TRUE, 'hot', 1, 1),
  (3, 'Fresh Lemonade', 'House-made lemonade served chilled.', 4.50, NULL, TRUE, 'none', 1, 1),
  (3, 'Iced Coffee', 'Cold coffee with milk and ice.', 5.50, NULL, TRUE, 'none', 1, 1),
  (4, 'Chocolate Brownie', 'Warm brownie served with chocolate sauce.', 7.00, NULL, TRUE, 'none', 1, 1);

INSERT INTO orders (user_id, order_number, status, total_amount, customer_note)
VALUES
  (2, 'SD-1001', 'pending', 25.40, 'Please make the noodles less spicy.'),
  (2, 'SD-1002', 'completed', 13.00, 'Takeaway order.');

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total)
VALUES
  (1, 1, 1, 8.50, 8.50),
  (1, 3, 1, 16.90, 16.90),
  (2, 2, 1, 6.00, 6.00),
  (2, 8, 1, 7.00, 7.00);

INSERT INTO chatbot_rules (intent, keywords, response_template, is_database_aware)
VALUES
  ('menu_help', 'menu,food,dish,item,available,category', 'You can browse available food from the Menu page and filter items by category.', TRUE),
  ('order_help', 'order,cart,buy,checkout,place order', 'Choose menu items, add them to your order, review the order, and submit it for the kitchen.', FALSE),
  ('order_status', 'status,my order,track,ready,pending,completed', 'Logged-in customers can view their latest order status from the Orders page.', TRUE),
  ('spicy_food', 'spicy,hot,mild,spice', 'SmartDine marks menu items by spice level so customers can choose food that suits them.', TRUE),
  ('support', 'help,contact,admin,problem,issue', 'If you need help, contact the restaurant admin or ask a staff member to review your order.', FALSE);

INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
VALUES
  (1, 'CREATE', 'menu_item', 1, 'Initial menu seed data added.'),
  (2, 'CREATE', 'order', 1, 'Demo customer placed sample order SD-1001.');
