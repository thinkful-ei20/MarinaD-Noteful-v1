'use strict';

function logger (req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = {logger};