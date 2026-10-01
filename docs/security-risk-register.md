# Security and Risk Register

| Risk ID | Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R-01 | Weak or exposed passwords could allow unauthorized account access. | Medium | High | Store only bcrypt password hashes, enforce minimum password length, and never commit real passwords. | Back-end lead |
| R-02 | SQL injection could expose or damage database records. | Medium | High | Use parameterized MySQL queries through `mysql2`, avoid string-concatenated SQL, and validate inputs. | Back-end lead |
| R-03 | Unauthorized customers could access admin functions. | Medium | High | Apply role-based middleware to admin-only API routes and test customer access denial. | Back-end lead |
| R-04 | Invalid order/menu data could create unreliable records. | Medium | Medium | Validate required fields, numeric values, menu availability, and order quantities on the server. | Data/QA lead |
| R-05 | Chatbot may provide incorrect or overconfident answers. | Medium | Medium | Keep the chatbot rule-based, limit it to SmartDine topics, and document limitations clearly. | AI feature owner |
| R-06 | Sensitive data could be sent to public AI services. | Low | High | Do not use external AI APIs. SmartDine Assistant uses local rules and database queries only. | AI feature owner |
| R-07 | Database loss during testing could remove demo data. | Medium | Medium | Maintain schema and seed scripts so the database can be recreated. Avoid running destructive scripts on production data. | Data/QA lead |
| R-08 | Git merge conflicts could delay final submission. | Medium | Medium | Use feature branches, pull latest main before work, and merge through pull requests. | Team lead |
| R-09 | Public deployment may fail due to environment differences. | Medium | High | Document Node, MySQL, `.env`, install, build, and start steps. Test deployment URL before submission. | Team lead |
| R-10 | UI may be difficult to use on mobile screens. | Medium | Medium | Use responsive CSS, test mobile width, and capture responsive evidence. | Front-end lead |

## Security Practices Applied

- Session-based authentication is planned for logged-in users.
- Admin-only endpoints use role middleware.
- Passwords are handled with bcrypt in backend authentication logic.
- MySQL queries use parameterized statements.
- Helmet middleware is used for baseline Express security headers.
- The chatbot does not send data to external AI services.
