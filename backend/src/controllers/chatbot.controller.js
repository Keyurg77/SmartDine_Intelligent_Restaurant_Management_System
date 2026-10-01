const pool = require('../config/database');
const asyncHandler = require('../utils/async-handler');

const intents = [
  {
    name: 'recommendation',
    keywords: ['recommend', 'suggest', 'what should i eat', 'what food', 'best food', 'popular'],
    response: 'I can recommend food based on your taste.',
  },
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
  const directReply = buildDirectReply(lowerMessage, req.currentUser);
  if (directReply) {
    return res.json({
      intent: directReply.intent,
      options: directReply.options || [],
      reply: directReply.reply,
      suggestions: [],
    });
  }

  const intent = detectIntent(lowerMessage);
  let reply = intent.response;
  let suggestions = [];

  if (intent.name === 'recommendation') {
    const preference = detectFoodPreference(lowerMessage);
    if (!preference.hasPreference) {
      return res.json({
        intent: intent.name,
        reply: 'Sure. What kind of food do you feel like: spicy, not spicy, chicken, vegetarian, mains, starters, drinks, or dessert?',
        options: ['Spicy food', 'Not spicy', 'Chicken', 'Vegetarian', 'Mains', 'Starters', 'Drinks', 'Dessert'],
        suggestions: [],
      });
    }

    suggestions = await findMenuSuggestions(lowerMessage, preference.spicePreference, preference.category);
    if (suggestions.length > 0) {
      const names = suggestions.map((item) => `${item.name} ($${Number(item.price).toFixed(2)})`).join(', ');
      reply = `${buildRecommendationReply(preference)} I recommend: ${names}.`;
    } else {
      reply = 'I could not find a close match for that taste right now. Try asking for spicy, not spicy, mains, drinks, desserts, chicken, or vegetarian items.';
    }
  }

  if (intent.name === 'menu_search' || intent.name === 'spicy_food') {
    const spicePreference = detectSpicePreference(lowerMessage);
    const category = detectCategoryPreference(lowerMessage);
    suggestions = await findMenuSuggestions(lowerMessage, spicePreference, category);
    if (suggestions.length > 0) {
      const names = suggestions.map((item) => `${item.name} ($${Number(item.price).toFixed(2)})`).join(', ');
      reply = `${buildMenuReply(spicePreference, reply)} I found these matching menu items: ${names}.`;
    } else if (spicePreference === 'not_spicy') {
      reply = 'I could not find non-spicy matches right now. Try checking items marked as no spice or mild on the Menu page.';
    } else if (spicePreference === 'spicy') {
      reply = 'I could not find spicy matches right now. Try checking items marked as medium or hot on the Menu page.';
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
    options: [],
    reply,
    suggestions,
  });
});

function detectIntent(message) {
  let bestIntent = {
    name: 'fallback',
    response: 'I can help with menu recommendations, spice level, ordering steps, order status, and admin support. Try asking: recommend food, which items are not spicy, or how do I place an order?',
  };
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

function buildDirectReply(message, currentUser) {
  if (/^(hi|hello|hey|namaste)\b/.test(message)) {
    return {
      intent: 'greeting',
      reply: 'Hi. I am SmartDine Assistant. I can help you choose food, check spice levels, understand ordering, or view order status.',
      options: ['Recommend food', 'Not spicy', 'Spicy food', 'How to order'],
    };
  }

  if (/\b(how are you|how r u)\b/.test(message)) {
    return {
      intent: 'small_talk',
      reply: 'I am ready to help with SmartDine. Tell me what kind of food you feel like, or ask about orders and menu items.',
      options: ['Recommend food', 'Drinks', 'Dessert', 'Order status'],
    };
  }

  if (/\b(who am i|my account|am i logged in)\b/.test(message)) {
    if (currentUser) {
      return {
        intent: 'account',
        reply: `You are logged in as ${currentUser.fullName} with ${currentUser.role} access.`,
      };
    }

    return {
      intent: 'account',
      reply: 'You are not logged in right now. Login as a customer to place orders, or as admin to manage the restaurant.',
      options: ['Customer login', 'Admin login'],
    };
  }

  if (/\b(how to order|place order|how do i order|how can i order)\b/.test(message)) {
    return {
      intent: 'ordering_help',
      reply: 'Open Menu, add items to your order, then go to Orders and submit. You must be logged in as a customer to place an order.',
      options: ['Recommend food', 'Customer login'],
    };
  }

  return null;
}

function detectFoodPreference(message) {
  const spicePreference = detectSpicePreference(message);
  const category = detectCategoryPreference(message);
  const hasKeywordPreference = /\b(chicken|vegetarian|veg|beef|pasta|noodle|sweet|coffee|lemonade|starter|main|drink|dessert)\b/.test(message);

  return {
    category,
    hasPreference: Boolean(spicePreference || category || hasKeywordPreference),
    spicePreference,
  };
}

function detectSpicePreference(message) {
  if (/\b(not spicy|non spicy|non-spicy|no spice|no spicy|without spice|less spicy|mild|not hot)\b/.test(message)) {
    return 'not_spicy';
  }

  if (/\b(spicy|hot|spice)\b/.test(message)) {
    return 'spicy';
  }

  return null;
}

function detectCategoryPreference(message) {
  if (/\b(drink|drinks|beverage|coffee|lemonade)\b/.test(message)) return 'Drinks';
  if (/\b(dessert|desserts|sweet|brownie)\b/.test(message)) return 'Desserts';
  if (/\b(starter|starters|snack|appetizer|appetiser)\b/.test(message)) return 'Starters';
  if (/\b(main|mains|meal|lunch|dinner|chicken|beef|pasta|noodle|noodles|vegetarian|veg)\b/.test(message)) return 'Mains';
  return null;
}

function buildMenuReply(spicePreference, defaultReply) {
  if (spicePreference === 'not_spicy') {
    return 'Here are menu items with no spice or mild spice.';
  }

  if (spicePreference === 'spicy') {
    return 'Here are the spicy menu items I found.';
  }

  return defaultReply;
}

function buildRecommendationReply(preference) {
  if (preference.spicePreference === 'not_spicy') return 'Based on your preference for less spicy food,';
  if (preference.spicePreference === 'spicy') return 'Based on your spicy taste,';
  if (preference.category) return `Based on your interest in ${preference.category.toLowerCase()},`;
  return 'Based on your taste,';
}

async function findMenuSuggestions(message, spicePreference = null, category = null) {
  const terms = message
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]/gi, ''))
    .filter((term) => term.length >= 4 && !['spicy', 'spice', 'nonspicy', 'without', 'which', 'items', 'recommend', 'suggest', 'should', 'food'].includes(term))
    .slice(0, 4);

  const where = ['mi.is_available = TRUE'];
  const params = [];

  if (spicePreference === 'not_spicy') {
    where.push("mi.spice_level IN ('none', 'mild')");
  } else if (spicePreference === 'spicy') {
    where.push("mi.spice_level IN ('medium', 'hot')");
  }

  if (category) {
    where.push('c.name = ?');
    params.push(category);
  }

  if (terms.length > 0) {
    const conditions = terms.map(() => '(mi.name LIKE ? OR mi.description LIKE ? OR c.name LIKE ?)').join(' OR ');
    where.push(`(${conditions})`);
    params.push(...terms.flatMap((term) => [`%${term}%`, `%${term}%`, `%${term}%`]));
  }

  try {
    const [rows] = await pool.execute(
      `SELECT mi.id, mi.name, mi.price, mi.spice_level AS spiceLevel, c.name AS categoryName
       FROM menu_items mi
       INNER JOIN categories c ON c.id = mi.category_id
       WHERE ${where.join(' AND ')}
       ORDER BY mi.name ASC
       LIMIT 5`,
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
