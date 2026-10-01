# SmartDine Database Design

## Overview

The SmartDine database supports restaurant menu management, customer food
orders, order tracking, activity logging, and the rule-based SmartDine Assistant
chatbot. Table reservation is intentionally excluded from the current project
scope.

## Tables

| Table | Purpose |
| --- | --- |
| `users` | Stores admin and customer accounts. |
| `categories` | Groups menu items into food categories. |
| `menu_items` | Stores food details, price, availability, and spice level. |
| `orders` | Stores each customer order and current order status. |
| `order_items` | Stores the menu items and quantities inside an order. |
| `chatbot_rules` | Stores chatbot intents, keywords, and response templates. |
| `activity_logs` | Stores important user and admin actions for auditability. |

## Relationships

```text
users 1 ----- many orders
orders 1 ----- many order_items
menu_items 1 ----- many order_items
categories 1 ----- many menu_items
users 1 ----- many activity_logs
users 1 ----- many menu_items created/updated
```

## Core Design Decisions

- `users.role` separates admin and customer access.
- `menu_items.is_available` allows admins to hide unavailable food without
  deleting records.
- `orders.status` supports pending, preparing, ready, completed, and cancelled
  order states.
- `activity_logs` supports the assessment auditability requirement.
- `chatbot_rules` supports the intelligent feature without using an external AI
  service.

## Demo Data

The seed file includes:

- one demo admin account
- one demo customer account
- four food categories
- sample menu items
- sample customer orders
- starter chatbot intent rules
- sample activity logs

The password hashes in `seed.sql` are placeholders for planning and must be
replaced by real bcrypt hashes before the final demo.
