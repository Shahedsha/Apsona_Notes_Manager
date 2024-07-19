const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 9'],
    },
    backgroundColor: {
      type: String,
      default: '#a4e8e8',
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 9;
}

const NotesModel = mongoose.model('Notes', notesSchema);

module.exports = NotesModel;