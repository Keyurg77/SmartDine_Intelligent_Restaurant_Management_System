# SmartDine Collaboration Plan

This plan is for genuine GitHub collaboration. Each team member should upload
their own work using their own GitHub account, preferably through a feature
branch and pull request.

## Recommended Branches

| Branch | Owner role | Feature area |
| --- | --- | --- |
| `main` | Team lead | Stable submitted version only |
| `feature/project-setup` | Team lead | README, folder structure, environment guide |
| `feature/database-schema` | Data/QA lead | MySQL schema, seed data, ERD updates |
| `feature/auth-roles` | Back-end lead | Register, login, logout, sessions, admin/user roles |
| `feature/menu-crud` | Back-end lead | Menu categories/items CRUD and validation |
| `feature/reservations` | Front-end/back-end | Reservation form, reservation management, status updates |
| `feature/orders` | Front-end/back-end | Cart/order flow, order records, order status |
| `feature/chatbot-assistant` | AI feature owner | Rule-based SmartDine chatbot and database-aware answers |
| `feature/admin-dashboard` | Front-end lead | Admin screens, stats cards, management navigation |
| `feature/responsive-ui` | Front-end lead | Mobile layout, accessibility, shared styling |
| `feature/testing-docs` | Data/QA lead | Test cases, screenshots/logs, risk register, AI appendix |
| `feature/deployment-docs` | Team lead | Deployment notes, final README, public URL section |

## Commit Checkpoints

Use several small commits instead of one large upload. Good commit messages:

| Feature | Suggested commit messages |
| --- | --- |
| Project setup | `Initialize Express project structure` |
| Project setup | `Add environment configuration guide` |
| Database | `Add SmartDine database schema` |
| Database | `Add seed data for demo menu and users` |
| Auth | `Add user registration and password hashing` |
| Auth | `Add login logout and role middleware` |
| Menu CRUD | `Add menu item CRUD routes` |
| Menu CRUD | `Add menu validation and admin views` |
| Reservations | `Add reservation request form` |
| Reservations | `Add admin reservation status update` |
| Orders | `Add cart and order creation flow` |
| Orders | `Add order status management` |
| Chatbot | `Add SmartDine assistant intent rules` |
| Chatbot | `Connect chatbot to menu and reservation data` |
| UI | `Add responsive navigation and shared styles` |
| Testing/docs | `Add functional test cases and risk register` |

## Reminder Rules For This Chat

After each completed feature, Codex should remind the user:

1. Which branch should receive the files.
2. Which teammate role should upload them.
3. Which commit message should be used.
4. Whether the teammate should open a pull request into `main`.

Example reminder:

> Upload these files through the GitHub browser on branch
> `feature/chatbot-assistant` using the actual teammate's GitHub account.
> Suggested commit message: `Add SmartDine assistant intent rules`.
> Then open a pull request into `main`.

## Pull Request Pattern

Every feature branch should open a pull request into `main`.

Recommended PR title format:

`Feature: Add menu CRUD`

Recommended PR description:

```text
Summary
- Added menu item create/read/update/delete functionality.
- Added server-side validation for required fields.
- Updated admin navigation.

Testing
- Tested adding a new menu item.
- Tested editing menu item price.
- Tested deleting a menu item.
```

## Suggested Team Split

| Team member | Role | Main branches |
| --- | --- | --- |
| Member 1 | Team lead / Scrum | `feature/project-setup`, `feature/deployment-docs` |
| Member 2 | Back-end lead | `feature/auth-roles`, `feature/menu-crud` |
| Member 3 | Front-end lead | `feature/reservations`, `feature/orders`, `feature/responsive-ui` |
| Member 4 | Data/QA and AI lead | `feature/database-schema`, `feature/chatbot-assistant`, `feature/testing-docs` |

If there are only three members, combine Data/QA with Team Lead or Back-end.
