const pool = require('../config/database');
const asyncHandler = require('../utils/async-handler');

const intents = [
  {
    name: 'order_status',
    keywords: ['status', 'track', 'ready', 'pending', 'completed', 'my order'],
    response: 'Logged-in customers can open the Orders page to check whether an order is pending, preparing, ready, completed, or cancelled.',
  },
  {
    name: 'spicy_food',
    keywords: ['spicy', 'hot', 'mild', 'spice'],
    response: 'SmartDine marks menu items by spice level so customers can choose food that suits them.',
  },
  {
    name: 'menu_search',
    keywords: ['menu', 'food', 'dish', 'item', 'available', 'category', 'chicken', 'drink', 'dessert'],
    response: 'Use the Menu page to search food by name and filter items by category.',
  },
  {
    name: 'ordering_help',
    keywords: ['order', 'cart', 'checkout', 'buy', 'place'],
    response: 'Choose menu items, add them to your order, review the order, and submit it for the kitchen.',
  },
  {
    name: 'admin_help',
    keywords: ['admin', 'manage', 'dashboard', 'update'],
    response: 'Admins can manage menu items and update order status from the admin dashboard.',
  },
];

const sendMessage = asyncHandler(async (req, res) => {
  const message = String(req.body.message || '').trim();

  if (!message) {
    return res.status(400).json({ message: 'A chatbot message is required.' });
  }

  const lowerMessage = message.toLowerCase();
  const intent = detectIntent(lowerMessage);
  let reply = intent.response;
  let suggestions = [];

  if (intent.name === 'menu_search' || intent.name === 'spicy_food') {
    suggestions = await findMenuSuggestions(lowerMessage);
    if (suggestions.length > 0) {
      const names = suggestions.map((item) => `${item.name} ($${Number(item.price).toFixed(2)})`).join(', ');
      reply = `${reply} I found these matching menu items: ${names}.`;
    }
  }

  if (intent.name === 'order_status' && req.currentUser) {
    const latestOrder = await findLatestOrder(req.currentUser.id);
    if (latestOrder) {
      reply = `Your latest order ${latestOrder.orderNumber} is currently ${latestOrder.status}.`;
    }
  }

  return res.json({
    intent: intent.name,
    reply,
    suggestions,
  });
});

function detectIntent(message) {
  let bestIntent = intents[intents.length - 1];
  let bestScore = 0;

  for (const intent of intents) {
    const score = intent.keywords.reduce((total, keyword) => {
      return message.includes(keyword) ? total + 1 : total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

async function findMenuSuggestions(message) {
  const terms = message
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/gi, ''))
    .filter((term) => term.length >= 4)
    .slice(0, 4);

  if (terms.length === 0) {
    return [];
  }

  const conditions = terms.map(() => '(mi.name LIKE ? OR mi.description LIKE ? OR c.name LIKE ?)').join(' OR ');
  const params = terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]);

  try {
    const [rows] = await pool.execute(
      `SELECT mi.id, mi.name, mi.price, c.name AS categoryName
       FROM menu_items mi
       INNER JOIN categories c ON c.id = mi.category_id
       WHERE mi.is_available = TRUE AND (${conditions})
       ORDER BY mi.name ASC
       LIMIT 3`,
      params
    );
    return rows;
  } catch (error) {
    return [];
  }
}

async function findLatestOrder(userId) {
  try {
    const [rows] = await pool.execute(
      `SELECT order_number AS orderNumber, status
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  } catch (error) {
    return null;
  }
}

module.exports = { sendMessage };
