const logger = require('../middlewares/loggin.middleware');
const config = require('config');
const mongoose = require('mongoose');

module.exports = () => {
   mongoose.connect(config.get('db.url'), { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => logger.info(`Successfully connected to ${config.get('db.scope')} database`));
};
