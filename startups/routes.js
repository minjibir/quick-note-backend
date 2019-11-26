
const usersRouter = require('../routes/users');
const noteRouter = require('../routes/note.route');
const error = require('../middlewares/error.middleware');

module.exports = (app) => {
   app.use('/users', usersRouter);
   app.use('/api/notes', noteRouter);
   app.get('/', async (req, res) => res.json({ result: 'Index page of Quick Note App' }));
   app.use(error);
};
