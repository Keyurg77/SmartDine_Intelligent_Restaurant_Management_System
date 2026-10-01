const pool = require('../config/database');

async function logActivity({ userId, action, entityType, entityId = null, details = null }) {
  await pool.execute(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
     VALUES (?, ?, ?, ?, ?)`,
    [userId || null, action, entityType, entityId, details]
  );
}

module.exports = { logActivity };
