const mysql = require('mysql2/promise');
const fs = require('fs');
const { env } = require('./env');

const sslConfig = env.db.ssl
  ? {
      rejectUnauthorized: env.db.sslRejectUnauthorized,
      ...(env.db.sslCaPath ? { ca: fs.readFileSync(env.db.sslCaPath, 'utf8') } : {}),
    }
  : undefined;

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  ...(sslConfig ? { ssl: sslConfig } : {}),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
