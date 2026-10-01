function attachCurrentUser(req, res, next) {
  req.currentUser = req.session.user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.currentUser.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    return next();
  };
}

module.exports = {
  attachCurrentUser,
  requireAuth,
  requireRole,
};
