-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: smartdine_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(60) NOT NULL,
  `entity_id` int DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_activity_logs_user` (`user_id`),
  KEY `idx_activity_logs_entity` (`entity_type`,`entity_id`),
  CONSTRAINT `fk_activity_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (1,1,'CREATE','menu_item',1,'Initial menu seed data added.','2026-10-01 06:36:09'),(2,2,'CREATE','order',1,'Demo customer placed sample order SD-1001.','2026-10-01 06:36:09'),(3,2,'LOGIN','user',2,'User logged in.','2026-10-01 11:42:14'),(4,1,'LOGIN','user',1,'User logged in.','2026-10-01 11:42:14'),(5,1,'LOGIN','user',1,'User logged in.','2026-10-01 12:18:07'),(8,1,'LOGIN','user',1,'User logged in.','2026-10-01 12:26:19'),(10,2,'LOGIN','user',2,'User logged in.','2026-10-01 12:27:26'),(11,2,'LOGIN','user',2,'User logged in.','2026-10-01 12:27:26'),(12,2,'LOGIN','user',2,'User logged in.','2026-10-01 12:27:27'),(13,2,'LOGIN','user',2,'User logged in.','2026-10-01 12:27:27'),(14,2,'LOGIN','user',2,'User logged in.','2026-10-01 12:28:59'),(15,1,'LOGIN','user',1,'User logged in.','2026-10-01 12:28:59'),(17,2,'LOGIN','user',2,'User logged in.','2026-10-01 13:38:00'),(18,2,'CREATE','order',6,'Created order SD-1790861910950.','2026-10-01 13:38:30'),(19,2,'LOGOUT','user',2,'User logged out.','2026-10-01 13:38:43'),(20,1,'LOGIN','user',1,'User logged in.','2026-10-01 13:38:54'),(21,1,'UPDATE_STATUS','order',1,'Updated order status to completed.','2026-10-01 13:39:07'),(22,1,'UPDATE_STATUS','order',6,'Updated order status to completed.','2026-10-01 13:39:14'),(23,1,'UPDATE_STATUS','order',6,'Updated order status to preparing.','2026-10-01 13:39:15'),(24,1,'UPDATE_STATUS','order',6,'Updated order status to completed.','2026-10-01 13:39:40'),(25,1,'UPDATE_STATUS','order',6,'Updated order status to cancelled.','2026-10-01 13:39:43'),(26,1,'UPDATE_STATUS','order',6,'Updated order status to cancelled.','2026-10-01 13:39:44'),(27,1,'LOGOUT','user',1,'User logged out.','2026-10-01 13:40:53'),(28,2,'LOGIN','user',2,'User logged in.','2026-10-01 13:40:58'),(29,2,'LOGOUT','user',2,'User logged out.','2026-10-01 13:41:19'),(30,2,'LOGIN','user',2,'User logged in.','2026-10-01 15:09:38'),(31,2,'LOGOUT','user',2,'User logged out.','2026-10-01 15:11:28'),(32,1,'LOGIN','user',1,'User logged in.','2026-10-01 15:11:31'),(33,1,'UPDATE_STATUS','order',6,'Updated order status to pending.','2026-10-01 15:11:43'),(34,1,'UPDATE_STATUS','order',6,'Updated order status to completed.','2026-10-01 15:11:47'),(35,2,'LOGIN','user',2,'User logged in.','2026-10-01 15:15:47'),(36,2,'LOGOUT','user',2,'User logged out.','2026-10-01 15:15:55'),(37,1,'LOGIN','user',1,'User logged in.','2026-10-01 15:16:11'),(38,2,'LOGIN','user',2,'User logged in.','2026-10-01 15:19:41'),(39,2,'LOGIN','user',2,'User logged in.','2026-10-01 15:29:09'),(40,2,'LOGOUT','user',2,'User logged out.','2026-10-01 15:29:52'),(41,1,'LOGIN','user',1,'User logged in.','2026-10-01 15:29:58'),(42,1,'LOGOUT','user',1,'User logged out.','2026-10-01 15:31:13'),(43,2,'LOGIN','user',2,'User logged in.','2026-10-01 15:31:19'),(44,2,'LOGIN','user',2,'User logged in.','2026-10-01 16:00:11'),(45,2,'LOGOUT','user',2,'User logged out.','2026-10-01 16:00:13'),(46,2,'LOGIN','user',2,'User logged in.','2026-10-01 16:35:50'),(47,2,'CREATE','order',7,'Created order SD-1790872560807.','2026-10-01 16:36:01'),(48,2,'LOGOUT','user',2,'User logged out.','2026-10-01 16:36:02'),(49,1,'LOGIN','user',1,'User logged in.','2026-10-01 16:36:05'),(50,1,'UPDATE_STATUS','order',7,'Updated order status to preparing.','2026-10-01 16:36:09'),(51,1,'LOGOUT','user',1,'User logged out.','2026-10-01 16:36:14'),(52,2,'LOGIN','user',2,'User logged in.','2026-10-03 07:08:55'),(53,2,'LOGOUT','user',2,'User logged out.','2026-10-03 07:09:30'),(54,1,'LOGIN','user',1,'User logged in.','2026-10-03 07:11:40'),(55,1,'LOGIN','user',1,'User logged in.','2026-10-03 07:18:23'),(56,1,'CREATE','menu_item',9,'Created menu item Mild Masala Fries.','2026-10-03 07:18:47');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Starters','Small dishes and appetizers.',1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(2,'Mains','Main meals served fresh from the kitchen.',1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(3,'Drinks','Cold and hot beverages.',1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(4,'Desserts','Sweet dishes and desserts.',1,'2026-10-01 06:36:09','2026-10-01 06:36:09');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_rules`
--

DROP TABLE IF EXISTS `chatbot_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `intent` varchar(80) NOT NULL,
  `keywords` varchar(255) NOT NULL,
  `response_template` text NOT NULL,
  `is_database_aware` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_rules`
--

LOCK TABLES `chatbot_rules` WRITE;
/*!40000 ALTER TABLE `chatbot_rules` DISABLE KEYS */;
INSERT INTO `chatbot_rules` VALUES (1,'menu_help','menu,food,dish,item,available,category','You can browse available food from the Menu page and filter items by category.',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(2,'order_help','order,cart,buy,checkout,place order','Choose menu items, add them to your order, review the order, and submit it for the kitchen.',0,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(3,'order_status','status,my order,track,ready,pending,completed','Logged-in customers can view their latest order status from the Orders page.',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(4,'spicy_food','spicy,hot,mild,spice','SmartDine marks menu items by spice level so customers can choose food that suits them.',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(5,'support','help,contact,admin,problem,issue','If you need help, contact the restaurant admin or ask a staff member to review your order.',0,1,'2026-10-01 06:36:09','2026-10-01 06:36:09');
/*!40000 ALTER TABLE `chatbot_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `spice_level` enum('none','mild','medium','hot') NOT NULL DEFAULT 'none',
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_menu_items_created_by` (`created_by`),
  KEY `fk_menu_items_updated_by` (`updated_by`),
  KEY `idx_menu_items_name` (`name`),
  KEY `idx_menu_items_category` (`category_id`),
  CONSTRAINT `fk_menu_items_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_items_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_items_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,1,'Crispy Spring Rolls','Vegetable spring rolls with sweet chilli sauce.',8.50,NULL,1,'mild',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(2,1,'Garlic Bread','Toasted bread with garlic butter and herbs.',6.00,NULL,1,'none',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(3,2,'Grilled Chicken Bowl','Grilled chicken served with rice, salad, and house sauce.',16.90,NULL,1,'medium',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(4,2,'Vegetable Pasta','Pasta with seasonal vegetables and tomato basil sauce.',14.50,NULL,1,'none',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(5,2,'Spicy Beef Noodles','Noodles with beef strips, vegetables, and spicy sauce.',15.90,NULL,1,'hot',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(6,3,'Fresh Lemonade','House-made lemonade served chilled.',4.50,NULL,1,'none',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(7,3,'Iced Coffee','Cold coffee with milk and ice.',5.50,NULL,1,'none',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(8,4,'Chocolate Brownie','Warm brownie served with chocolate sauce.',7.00,NULL,1,'none',1,1,'2026-10-01 06:36:09','2026-10-01 06:36:09'),(9,1,'Mild Masala Fries','Crispy fries tossed with mild masala seasoning.',6.50,NULL,1,'mild',1,1,'2026-10-03 07:18:47','2026-10-03 07:18:47');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_order` (`order_id`),
  KEY `fk_order_items_menu_item` (`menu_item_id`),
  CONSTRAINT `fk_order_items_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_order_items_quantity` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,8.50,8.50),(2,1,3,1,16.90,16.90),(3,2,2,1,6.00,6.00),(4,2,8,1,7.00,7.00),(8,6,8,1,7.00,7.00),(9,7,8,1,7.00,7.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_number` varchar(30) NOT NULL,
  `status` enum('pending','preparing','ready','completed','cancelled') NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `customer_note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'SD-1001','completed',25.40,'Please make the noodles less spicy.','2026-10-01 06:36:09','2026-10-01 13:39:07'),(2,2,'SD-1002','completed',13.00,'Takeaway order.','2026-10-01 06:36:09','2026-10-01 06:36:09'),(6,2,'SD-1790861910950','completed',7.00,NULL,'2026-10-01 13:38:30','2026-10-01 15:11:47'),(7,2,'SD-1790872560807','preparing',7.00,NULL,'2026-10-01 16:36:00','2026-10-01 16:36:09');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'SmartDine Admin','admin@smartdine.test','$2b$10$/z.teGIIlWsZd41.em6C.O7Y3lWnh55Ip.Q.Mlwh35Z7qojaQOEQW','admin','active','2026-10-01 06:36:09','2026-10-01 11:41:49'),(2,'Demo Customer','customer@smartdine.test','$2b$10$DCLvpiCUg64flemwH9KTeu92yJ7nULbJjAKvv6hss0VXPL.ErI6OG','customer','active','2026-10-01 06:36:09','2026-10-01 11:41:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-04 13:25:58
