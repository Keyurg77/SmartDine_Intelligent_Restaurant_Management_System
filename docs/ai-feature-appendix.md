# Intelligent / AI Feature Appendix

## Feature Name

SmartDine Assistant - Rule-Based Restaurant Support Chatbot

## Purpose

SmartDine Assistant helps users understand the restaurant system. It answers common questions about menu browsing, ordering, spice levels, order status, admin support, and general help. The feature is designed to satisfy the intelligent/AI-assisted requirement without using an external AI service.

## How It Works

1. The user types a question in the React Assistant screen.
2. The frontend sends the message to the backend endpoint:

```text
POST /api/chatbot/message
```

3. The backend checks the message against predefined keyword groups.
4. The system detects the most likely intent, such as:

- `menu_search`
- `ordering_help`
- `order_status`
- `spicy_food`
- `admin_help`

5. The backend returns a response template.
6. Where possible, the chatbot can use database information, such as matching menu items or the latest logged-in user's order status.
7. If the backend/database is unavailable, the React frontend uses local fallback responses so the UI still demonstrates the assistant behaviour.

## Example Interactions

| User question | Detected intent | Example response |
| --- | --- | --- |
| How do I check order status? | `order_status` | Logged-in customers can open the Orders page to check whether an order is pending, preparing, ready, completed, or cancelled. |
| Do you have spicy food? | `spicy_food` | SmartDine marks menu items by spice level so customers can choose food that suits them. |
| Show me chicken items | `menu_search` | The assistant searches available menu item names, descriptions, and categories. |
| How do I place an order? | `ordering_help` | Choose menu items, add them to your order, review the order, and submit it for the kitchen. |

## Responsible Use

- The chatbot does not make final decisions for the user.
- Users remain responsible for placing or changing orders.
- No personal or sensitive information is sent to public AI services.
- The feature is explainable because it uses keywords, rules, and database queries.
- Automatically generated responses are informational and limited to SmartDine.

## Limitations

- The chatbot is not a general-purpose AI assistant.
- It may not understand complex or unrelated questions.
- It depends on keyword matching, so unusual wording may produce a general fallback response.
- It should not be used for payment, legal, medical, or emergency advice.
- It does not replace staff confirmation for real restaurant issues.

## Mitigation

- Keep responses short and related to restaurant workflows.
- Provide fallback responses when intent confidence is low.
- Document how the assistant works in the README and presentation.
- Avoid external AI APIs to reduce privacy and deployment risk.
