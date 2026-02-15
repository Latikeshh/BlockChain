const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true,
    default: 'Admin'
  },

  category: {
    type: String,
    required: true,
    enum: ['World', 'Politics', 'Business', 'Bollywood', 'Sports', 'Tech', 'Other']
  },

  tags: {
    type: [String],
    default: []
  },

  imageUrl: {
    type: String,
    default: ''  // You can store image URL or file path
  },

  isBreaking: {
    type: Boolean,
    default: false
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  isDeleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update timestamp before save/update
newsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
newsSchema.pre('findOneAndUpdate', function (next) {
  this._update.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('News', newsSchema);
