# SmartDine: Intelligent Restaurant Management System

SmartDine is a full-stack restaurant management web application for ICT203
Assessment 3. The system focuses on menu browsing, food ordering, admin menu
management, order status tracking, and a simple rule-based SmartDine Assistant
chatbot.

## Technology Stack

- Node.js
- Express.js
- MySQL
- EJS templates
- HTML, CSS, JavaScript

## Current Project Scope

Included:

- User authentication and role-based access
- Menu category and menu item management
- Food ordering workflow
- Order status management
- Search and filtering for menu items
- Activity/audit logging
- SmartDine Assistant chatbot
- Testing and documentation evidence

Not included for the current version:

- Table reservations
- Delivery driver management
- Payment gateway integration
- External AI API integration

## Project Structure

```text
backend/
  src/
    config/
    middleware/
    routes/
    app.js
    server.js
frontend/
  public/
    css/
    js/
  views/
    pages/
    partials/
database/
docs/
```

## Branch Workflow

Main branches:

- `feature/project-setups`
- `feature/database`
- `feature/backend`
- `feature/frontend`
- `feature/chatbot`
- `feature/testing-docs`

Each feature should be uploaded by the assigned team member using their own
GitHub account, then merged into `main` through a pull request.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and update database credentials.

3. Start the development server:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Demo Accounts

Demo accounts will be added after the database seed data is completed.

## Intelligent Feature

SmartDine Assistant is a rule-based chatbot. It answers user questions about
menu items, food categories, ordering steps, order status, and restaurant help.
It uses local application rules and database information, not an external AI
service.
