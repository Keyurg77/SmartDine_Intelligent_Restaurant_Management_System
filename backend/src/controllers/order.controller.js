const pool = require('../config/database');
const asyncHandler = require('../utils/async-handler');
const { toPositiveInteger } = require('../utils/validators');
const { logActivity } = require('../services/activity.service');

const allowedStatuses = new Set(['pending', 'preparing', 'ready', 'completed', 'cancelled']);

const listOrders = asyncHandler(async (req, res) => {
  const params = [];
  let whereClause = '';

  if (req.currentUser.role !== 'admin') {
    whereClause = 'WHERE o.user_id = ?';
    params.push(req.currentUser.id);
  }

  const [orders] = await pool.execute(
    `SELECT
       o.id,
       o.order_number AS orderNumber,
       o.status,
       o.total_amount AS totalAmount,
       o.customer_note AS customerNote,
       o.created_at AS createdAt,
       u.full_name AS customerName
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ${whereClause}
     ORDER BY o.created_at DESC`,
    params
  );

  return res.json({ orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const id = toPositiveInteger(Number(req.params.id));
  if (!id) {
    return res.status(400).json({ message: 'Valid order id is required.' });
  }

  const order = await findVisibleOrder(id, req.currentUser);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const [items] = await pool.execute(
    `SELECT
       oi.id,
       oi.quantity,
       oi.unit_price AS unitPrice,
       oi.line_total AS lineTotal,
       mi.name
     FROM order_items oi
     INNER JOIN menu_items mi ON mi.id = oi.menu_item_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [id]
  );

  return res.json({ order, items });
});

const createOrder = asyncHandler(async (req, res) => {
  if (req.currentUser.role !== 'customer') {
    return res.status(403).json({ message: 'Only customer accounts can create orders.' });
  }

  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const customerNote = String(req.body.customerNote || '').trim() || null;

  if (items.length === 0) {
    return res.status(400).json({ message: 'At least one order item is required.' });
  }

  const parsedItems = items.map((item) => ({
    menuItemId: toPositiveInteger(Number(item.menuItemId)),
    quantity: toPositiveInteger(Number(item.quantity)),
  }));

  if (parsedItems.some((item) => !item.menuItemId || !item.quantity)) {
    return res.status(400).json({ message: 'Each order item needs a valid menu item and quantity.' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const menuItemIds = parsedItems.map((item) => item.menuItemId);
    const placeholders = menuItemIds.map(() => '?').join(', ');
    const [menuItems] = await connection.execute(
      `SELECT id, name, price
       FROM menu_items
       WHERE is_available = TRUE AND id IN (${placeholders})`,
      menuItemIds
    );

    if (menuItems.length !== menuItemIds.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'One or more menu items are unavailable.' });
    }

    const menuById = new Map(menuItems.map((item) => [item.id, item]));
    const orderNumber = `SD-${Date.now()}`;
    const totalAmount = parsedItems.reduce((total, item) => {
      const menuItem = menuById.get(item.menuItemId);
      return total + Number(menuItem.price) * item.quantity;
    }, 0);

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, status, total_amount, customer_note)
       VALUES (?, ?, 'pending', ?, ?)`,
      [req.currentUser.id, orderNumber, totalAmount.toFixed(2), customerNote]
    );

    for (const item of parsedItems) {
      const menuItem = menuById.get(item.menuItemId);
      const lineTotal = Number(menuItem.price) * item.quantity;

      await connection.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.menuItemId, item.quantity, menuItem.price, lineTotal.toFixed(2)]
      );
    }

    await connection.execute(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
       VALUES (?, 'CREATE', 'order', ?, ?)`,
      [req.currentUser.id, orderResult.insertId, `Created order ${orderNumber}.`]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Order created.',
      orderId: orderResult.insertId,
      orderNumber,
      totalAmount: Number(totalAmount.toFixed(2)),
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = toPositiveInteger(Number(req.params.id));
  const status = String(req.body.status || '').trim();

  if (!id || !allowedStatuses.has(status)) {
    return res.status(400).json({ message: 'Valid order id and status are required.' });
  }

  const [result] = await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  await logActivity({
    userId: req.currentUser.id,
    action: 'UPDATE_STATUS',
    entityType: 'order',
    entityId: id,
    details: `Updated order status to ${status}.`,
  });

  return res.json({ message: 'Order status updated.' });
});

async function findVisibleOrder(orderId, currentUser) {
  const params = [orderId];
  let ownerFilter = '';

  if (currentUser.role !== 'admin') {
    ownerFilter = 'AND o.user_id = ?';
    params.push(currentUser.id);
  }

  const [orders] = await pool.execute(
    `SELECT
       o.id,
       o.order_number AS orderNumber,
       o.status,
       o.total_amount AS totalAmount,
       o.customer_note AS customerNote,
       o.created_at AS createdAt,
       u.full_name AS customerName
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     WHERE o.id = ? ${ownerFilter}
     LIMIT 1`,
    params
  );

  return orders[0] || null;
}

module.exports = {
  listOrders,
  createOrder,
  getOrder,
  updateOrderStatus,
};
