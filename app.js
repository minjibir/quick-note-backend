const logger = require('./middlewares/loggin.middleware');
const app = require('express')();
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (ex) => {
  logger.error(ex);
  process.exit(1);
});

process.on('unhandledRejection', (ex) => {
  logger.error(ex);
  process.exit(1);
});

require('./startups/middlewares')(app);
require('./startups/database')();
require('./startups/routes')(app);

module.exports = app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
