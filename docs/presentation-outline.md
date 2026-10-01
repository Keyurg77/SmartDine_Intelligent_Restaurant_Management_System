# Presentation Outline and Script

Target duration: 10-12 minutes.

## Slide 1 - Project Title

**SmartDine: Intelligent Restaurant Management System**

Script: SmartDine is a full-stack restaurant management web application designed for a small restaurant. It supports menu browsing, food ordering, admin management, order status tracking, and a rule-based chatbot assistant.

## Slide 2 - Problem and Users

Key points:

- Small restaurants often manage menus and orders manually.
- Manual workflows can cause delays, mistakes, and poor order tracking.
- Customers need an easy way to browse food and understand ordering steps.

Script: Our target users are restaurant customers and restaurant administrators. Customers browse menu items and place orders. Admins manage menu availability and order progress.

## Slide 3 - System Features

Key points:

- Authentication and roles
- Menu categories and menu items
- Food ordering workflow
- Order status management
- Search and filtering
- Activity/audit logs
- SmartDine Assistant chatbot

Script: These features map directly to the ICT203 requirements: authentication, CRUD, database integration, responsive UI, testing, security, and an intelligent feature.

## Slide 4 - Architecture and Technology

Key points:

- React frontend
- Node.js and Express backend
- MySQL database
- REST API routes
- GitHub branches and pull requests

Script: The frontend communicates with Express API endpoints. The backend uses MySQL for persistent records and server-side validation.

## Slide 5 - Database Design

Key tables:

- users
- categories
- menu_items
- orders
- order_items
- chatbot_rules
- activity_logs

Script: The schema supports users, menu management, order records, chatbot rules, and auditability. Table reservation is intentionally excluded to keep scope manageable.

## Slide 6 - SmartDine Assistant

Key points:

- Rule-based chatbot
- Keyword/intent detection
- Menu and order support
- No external AI API
- Explainable and privacy-friendly

Script: The assistant identifies common intents such as order status, menu search, ordering help, and spice-level questions. It is simple, explainable, and aligned with responsible AI requirements.

## Slide 7 - Testing and Security

Key points:

- Positive and negative test cases
- Role-based access checks
- Password hashing
- Parameterized SQL queries
- Risk register
- Screenshot evidence

Script: We tested core workflows and prepared evidence screenshots. Security controls include bcrypt hashing, role middleware, validation, and parameterized queries.

## Slide 8 - Demo and Conclusion

Demo flow:

1. Open React frontend.
2. Search/filter menu.
3. Add item to order.
4. Show order status page.
5. Open assistant and ask an order/menu question.
6. Show admin dashboard.

Script: SmartDine demonstrates a practical full-stack system with a meaningful intelligent feature. The project is explainable, testable, and suitable for academic demonstration.
