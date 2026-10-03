const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const { env } = require('./config/env');
const webRoutes = require('./routes/web.routes');
const apiRoutes = require('./routes/api.routes');
const { attachCurrentUser } = require('./middleware/auth.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'views'));

app.use(helmet({ contentSecurityPolicy: false }));
app.use((req, res, next) => {
  const allowedOrigins = [
    env.frontendUrl,
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ].filter(Boolean);
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'public')));

app.use(
  session({
    name: 'smartdine.sid',
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
      secure: env.nodeEnv === 'production',
    },
  })
);

app.use(flash());
app.use(attachCurrentUser);
app.use((req, res, next) => {
  res.locals.appName = env.appName;
  res.locals.currentUser = req.currentUser;
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
  };
  next();
});

app.use('/', webRoutes);
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
