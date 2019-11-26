const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Note = mongoose.model('Notes', mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: new Date
  }
}));

const validate = function (note) {
  return Joi.object({
    _id: Joi.objectId(),
    text: Joi.string().required().min(3).max(120),
    addedAt: Joi.date(),
    __v: Joi.number()
  }).validate(note);
};

module.exports = {
  Note,
  validate
};
