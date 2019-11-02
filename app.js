const logger = require('morgan');
const config = require('config');
const express = require('express');
// const helmet = require('helmet');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const noteRouter = require('./routes/note.route');

const app = express();
const PORT = process.env.NODE_ENV.PORT || 6000;

// DB connection
mongoose.connect(config.get('db.url'), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to ${config.get('db.scope')} datastore.`))
  .catch(() => console.log(`Unable to connect to ${config.get('db.scope')} datastore.`));

// app.use(helmet);
app.use(logger('dev'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/api/notes', noteRouter);

module.exports = app.listen(PORT, () => console.log(`Server running at ${PORT}`));
