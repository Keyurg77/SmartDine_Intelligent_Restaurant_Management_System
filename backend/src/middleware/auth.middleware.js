function attachCurrentUser(req, res, next) {
  req.currentUser = req.session.user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }

  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Please log in to continue.' });
    }

    if (!roles.includes(req.currentUser.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    return next();
  };
}

module.exports = {
  attachCurrentUser,
  requireAuth,
  requireRole,
};
