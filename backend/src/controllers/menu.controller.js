const pool = require('../config/database');
const asyncHandler = require('../utils/async-handler');
const { isNonEmpty, toPositiveInteger, toPositiveNumber } = require('../utils/validators');
const { logActivity } = require('../services/activity.service');

const allowedSpiceLevels = new Set(['none', 'mild', 'medium', 'hot']);

const listCategories = asyncHandler(async (req, res) => {
  const [categories] = await pool.execute(
    `SELECT id, name, description, is_active AS isActive
     FROM categories
     WHERE is_active = TRUE
     ORDER BY name ASC`
  );

  return res.json({ categories });
});

const listMenuItems = asyncHandler(async (req, res) => {
  const search = String(req.query.search || '').trim();
  const categoryId = toPositiveInteger(Number(req.query.categoryId));
  const page = toPositiveInteger(Number(req.query.page)) || 1;
  const limit = Math.min(toPositiveInteger(Number(req.query.limit)) || 10, 50);
  const offset = (page - 1) * limit;

  const filters = ['mi.is_available = TRUE'];
  const params = [];

  if (search) {
    filters.push('(mi.name LIKE ? OR mi.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (categoryId) {
    filters.push('mi.category_id = ?');
    params.push(categoryId);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const [items] = await pool.execute(
    `SELECT
       mi.id,
       mi.name,
       mi.description,
       mi.price,
       mi.image_url AS imageUrl,
       mi.spice_level AS spiceLevel,
       c.name AS categoryName
     FROM menu_items mi
     INNER JOIN categories c ON c.id = mi.category_id
     ${whereClause}
     ORDER BY mi.name ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return res.json({
    page,
    limit,
    items,
  });
});

const getMenuItem = asyncHandler(async (req, res) => {
  const id = toPositiveInteger(Number(req.params.id));
  if (!id) {
    return res.status(400).json({ message: 'Please provide a valid menu item id.' });
  }

  const [items] = await pool.execute(
    `SELECT
       mi.id,
       mi.category_id AS categoryId,
       mi.name,
       mi.description,
       mi.price,
       mi.image_url AS imageUrl,
       mi.is_available AS isAvailable,
       mi.spice_level AS spiceLevel,
       c.name AS categoryName
     FROM menu_items mi
     INNER JOIN categories c ON c.id = mi.category_id
     WHERE mi.id = ?
     LIMIT 1`,
    [id]
  );

  if (!items[0]) {
    return res.status(404).json({ message: 'Menu item was not found or is no longer available.' });
  }

  return res.json({ item: items[0] });
});

const createMenuItem = asyncHandler(async (req, res) => {
  const payload = parseMenuPayload(req.body);
  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  const [result] = await pool.execute(
    `INSERT INTO menu_items
       (category_id, name, description, price, image_url, is_available, spice_level, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.categoryId,
      payload.name,
      payload.description,
      payload.price,
      payload.imageUrl,
      payload.isAvailable,
      payload.spiceLevel,
      req.currentUser.id,
      req.currentUser.id,
    ]
  );

  await logActivity({
    userId: req.currentUser.id,
    action: 'CREATE',
    entityType: 'menu_item',
    entityId: result.insertId,
    details: `Created menu item ${payload.name}.`,
  });

  return res.status(201).json({
    message: 'Menu item created.',
    id: result.insertId,
  });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const id = toPositiveInteger(Number(req.params.id));
  const payload = parseMenuPayload(req.body);

  if (!id) {
    return res.status(400).json({ message: 'Please provide a valid menu item id.' });
  }

  if (payload.error) {
    return res.status(400).json({ message: payload.error });
  }

  const [result] = await pool.execute(
    `UPDATE menu_items
     SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?,
         is_available = ?, spice_level = ?, updated_by = ?
     WHERE id = ?`,
    [
      payload.categoryId,
      payload.name,
      payload.description,
      payload.price,
      payload.imageUrl,
      payload.isAvailable,
      payload.spiceLevel,
      req.currentUser.id,
      id,
    ]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Menu item was not found, so no update was made.' });
  }

  await logActivity({
    userId: req.currentUser.id,
    action: 'UPDATE',
    entityType: 'menu_item',
    entityId: id,
    details: `Updated menu item ${payload.name}.`,
  });

  return res.json({ message: 'Menu item updated.' });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const id = toPositiveInteger(Number(req.params.id));
  if (!id) {
    return res.status(400).json({ message: 'Please provide a valid menu item id.' });
  }

  const [result] = await pool.execute('UPDATE menu_items SET is_available = FALSE WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Menu item was not found, so it could not be removed.' });
  }

  await logActivity({
    userId: req.currentUser.id,
    action: 'DELETE',
    entityType: 'menu_item',
    entityId: id,
    details: 'Marked menu item unavailable.',
  });

  return res.json({ message: 'Menu item removed from active menu.' });
});

function parseMenuPayload(body) {
  const categoryId = toPositiveInteger(Number(body.categoryId));
  const price = toPositiveNumber(body.price);
  const name = String(body.name || '').trim();
  const spiceLevel = String(body.spiceLevel || 'none').trim();

  if (!categoryId || !isNonEmpty(name) || !price) {
    return { error: 'Please choose a category, enter a menu item name, and use a price greater than 0.' };
  }

  if (!allowedSpiceLevels.has(spiceLevel)) {
    return { error: 'Please choose one of the supported spice levels: none, mild, medium, or hot.' };
  }

  return {
    categoryId,
    name,
    description: String(body.description || '').trim() || null,
    price,
    imageUrl: String(body.imageUrl || '').trim() || null,
    isAvailable: body.isAvailable === undefined ? true : Boolean(body.isAvailable),
    spiceLevel,
  };
}

module.exports = {
  listCategories,
  listMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
