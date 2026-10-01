# SmartDine: Intelligent Restaurant Management System

SmartDine is a full-stack restaurant management web application built for ICT203 Assessment 3. It supports menu browsing, customer ordering, role-based admin access, order status management, and a rule-based SmartDine Assistant chatbot.

## Technology Stack

- React with Vite
- Node.js and Express.js
- MySQL
- HTML, CSS, JavaScript

## Project Scope

Included:

- Customer registration and login
- Admin login
- Role-based access control
- Live menu loading from the MySQL database
- Menu search and category filtering
- Customer cart and order creation
- Admin menu item creation
- Admin order status updates
- Rule-based chatbot assistant
- Activity logging for important actions

## Folder Structure

```text
backend/      Express API, controllers, middleware, routes, and database config
frontend/     React/Vite user interface
database/     MySQL schema and seed data
docs/         Local assessment evidence and draft documents, ignored by Git
```

## Local Setup

1. Install dependencies:

```bash
npm install
npm --prefix frontend install
```

2. Create a local `.env` file from `.env.example` and update the MySQL password:

```text
DB_USER=root
DB_PASSWORD=root
DB_NAME=smartdine_db
```

3. Run the database scripts in MySQL Workbench:

```text
database/schema.sql
database/seed.sql
```

4. Start the backend:

```bash
npm run dev:backend
```

5. Start the frontend:

```bash
npm run dev:frontend
```

6. Open the frontend:

```text
http://127.0.0.1:5173
```

## Demo Accounts

Admin:

```text
Email: admin@smartdine.test
Password: Admin@123
```

Customer:

```text
Email: customer@smartdine.test
Password: Customer@123
```

## SmartDine Assistant

The assistant is rule-based. It can answer questions about menu items, spice levels, food recommendations, ordering steps, order status, and basic account context. It does not call an external AI service.

## Development Notes

- Admin users can manage menu items and update order status, but cannot create customer orders.
- Customer users can browse the menu and place orders.
- The chatbot appears as a popup on the bottom-right of the application.
- Local evidence screenshots and report drafts should stay inside `docs/`, which is ignored until reviewed.
