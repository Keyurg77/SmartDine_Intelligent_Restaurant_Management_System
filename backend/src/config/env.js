require('dotenv').config();

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const env = {
  appName: process.env.APP_NAME || 'SmartDine',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  sessionSecret: process.env.SESSION_SECRET || 'smartdine_dev_secret',
  frontendUrl: process.env.FRONTEND_URL || '',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartdine_db',
    ssl: parseBoolean(process.env.DB_SSL),
    sslCaPath: process.env.DB_SSL_CA_PATH || '',
    sslRejectUnauthorized: parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, true),
  },
};

module.exports = { env };
