const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const noteSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: new Date
  }
});

const Note = mongoose.model('Notes', noteSchema);
const validate = function (note) {
  return Joi.object({
    _id: Joi.string().alphanum().min(10).max(100),
    text: Joi.string().required().min(3).max(120),
    addedAt: Joi.date(),
    __v: Joi.number()
  }).validate(note);
}

module.exports = {
  Note,
  validate
};
