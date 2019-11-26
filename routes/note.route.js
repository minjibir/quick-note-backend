const express = require('express');
const mongoose = require('mongoose');
const { Note, validate } = require('../models/note.model');
const router = express.Router();

router.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.status(200).json(notes);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  // Probably should be removed to let system wide exception catch it.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ error: `Invalid note id.` });
  }

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

});

router.post('/', async (req, res) => {
  const { error, value } = validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const note = await Note.create(value);
  return res.status(201).json(note);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid note ID' });
  }

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
});

router.put('/', async (req, res) => {
  const { error, value } = validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const note = await Note.findById(value._id);

  if (!note) {
    return res.status(404).json({ error: 'Note with the specified ID does not exists.' });
  } else {
    await Note.findByIdAndUpdate(value._id, value);
    const updated = await Note.findById(value._id);
    res.status(200).json(updated);
  }
});

module.exports = router;
