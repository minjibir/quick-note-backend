const logger = require('morgan');
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const noteRouter = require('./routes/note.route');

const app = express();
const PORT = process.env.PORT || 3000;

// DB connection
mongoose.connect(config.get('db.url'), { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to ${config.get('db.scope')} datastore.`))
  .catch(() => console.log(`Unable to connect to ${config.get('db.scope')} datastore.`));

// Middlewares
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());

// Application routes
app.use('/users', usersRouter);
app.use('/api/notes', noteRouter);

app.get('/', async (req, res) => {
  res
    .status(200)
    .json({ result: 'Index page of Quick Note App' });
});

module.exPORTs = app.listen(PORT, () => console.log(`Server running on ${PORT}`));
