const express = require('express');
const mongoose = require('mongoose');
const { Note, validate } = require('../models/note.model');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({});

    res
      .status(200)
      .json(notes);
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ error: `Invalid note id.` });
  }

  try {
    const note = await Note.findById(id);

    if (note) {
      res
        .status(200)
        .json(note);
    } else {
      res
        .status(404)
        .json({ error: 'Note with that ID does not exists.' });
    }
  } catch (err) {
    res
      .status(404)
      .json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const reqBody = req.body;
  const { error, value } = validate(reqBody);

  if (error) {
    return res
      .status(400)
      .json({ error: error.message });
  }

  try {
    const note = await Note.create(value);

    res
      .status(201)
      .json(note);
  } catch (err) {
    res
      .status(400)
      .json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ error: 'Invalid note ID' })
  }

  try {
    const note = await Note.findById(id);

    if (note) {
      await Note.deleteOne({ _id: id });

      res
        .status(200)
        .json({ message: 'Note successfully deleted.' })
    } else {
      res
        .status(404)
        .json({ error: 'Note with this ID does not exists.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message });
  }
});

module.exports = router;
