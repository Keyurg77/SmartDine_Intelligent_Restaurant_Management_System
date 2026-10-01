const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const { env } = require('./config/env');
const webRoutes = require('./routes/web.routes');
const apiRoutes = require('./routes/api.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'frontend', 'views'));

app.use(helmet({ contentSecurityPolicy: false }));
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
      sameSite: 'lax',
      secure: env.nodeEnv === 'production',
    },
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.appName = env.appName;
  res.locals.currentUser = req.session.user || null;
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
