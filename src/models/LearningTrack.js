const mongoose = require('mongoose');

const learningTrackSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tags: [{ type: String }],
  // Lesson titles for this track.
  lessons: [{ type: String }],
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LearningTrack', learningTrackSchema);
