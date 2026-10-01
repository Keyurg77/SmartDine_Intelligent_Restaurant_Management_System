# SmartDine Test Cases

| Test ID | Feature | Scenario | Test Data / Input | Expected Result | Actual Result | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Frontend navigation | User opens the React frontend and switches between Menu, Orders, Admin, Assistant, and Login tabs. | Click each sidebar item. | Each section displays without page errors. | To be captured during final test. | Pending evidence | 01-smartdine-ui-working.png |
| TC-02 | Menu search | User searches for a menu item. | Search: `chicken` | Matching menu item cards are shown and unrelated items are filtered out. | To be captured during final test. | Pending evidence | 02-menu-search-filter-working.png |
| TC-03 | Category filter | User filters menu items by category. | Category: `Desserts` | Dessert menu items are shown. | To be captured during final test. | Pending evidence | 02-menu-search-filter-working.png |
| TC-04 | Cart/order UI | User adds menu items to the current order. | Add Chocolate Brownie and Grilled Chicken Bowl. | Order page shows selected items and total amount. | To be captured during final test. | Pending evidence | 03-order-cart-working.png |
| TC-05 | Chatbot response | User asks the SmartDine Assistant a menu/order question. | `How do I check order status?` | Assistant returns an order-status help response. | To be captured during final test. | Pending evidence | 04-chatbot-response-working.png |
| TC-06 | Admin UI | Admin opens dashboard/menu management screen. | Open Admin tab. | Dashboard metrics and menu management form are visible. | To be captured during final test. | Pending evidence | 05-admin-dashboard-working.png |
| TC-07 | Database schema | MySQL schema script is executed. | `database/schema.sql` | Required tables are created: users, categories, menu_items, orders, order_items, chatbot_rules, activity_logs. | Completed locally. | Pass | 06-mysql-schema-created.png |
| TC-08 | Seed data | Seed script is executed after schema creation. | `database/seed.sql` | Demo users, categories, menu items, orders, chatbot rules, and logs are inserted. | Completed locally. | Pass | 07-seed-data-loaded.png |
| TC-09 | Backend health/API | Backend API is checked. | GET `/api/health` | API returns status `ok`. | To be captured during final test. | Pending evidence | 08-backend-api-tested.png |
| TC-10 | Responsive layout | Frontend is tested on mobile width. | Browser responsive/mobile view. | Navigation and content remain usable without overlap. | To be captured during final test. | Pending evidence | 09-responsive-mobile-view.png |
| TC-11 | Negative auth validation | Register/login is attempted with missing or invalid fields. | Blank email/password. | Backend returns validation error and does not create invalid session. | To be tested during final backend run. | Pending | Optional screenshot/log |
| TC-12 | Admin access control | Customer attempts an admin-only route. | Customer session, menu create/update route. | Backend returns `403 Access denied`. | To be tested during final backend run. | Pending | Optional screenshot/log |

## Evidence Limit

Final report should use around 10 focused screenshots only. Replace lower-value screenshots with before/after bug screenshots if meaningful bugs are found.
