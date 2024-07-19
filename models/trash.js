const mongoose = require('mongoose');

const trashSchema = new mongoose.Schema(
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
      default: '#ffffff',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '30d', 
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 9;
}

const TrashModel = mongoose.model('Trash', trashSchema);

module.exports = TrashModel;