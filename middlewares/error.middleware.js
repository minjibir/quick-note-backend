const logger = require('./loggin.middleware');

module.exports = (err, req, res, next) => {
   logger.error(err.message, err);
   res.status(500).json({ error: err.message });
   // next(err);
};
