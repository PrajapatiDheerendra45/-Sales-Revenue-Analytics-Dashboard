const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  product: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  region: {
    type: String,
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  revenue: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
salesSchema.index({ date: 1, region: 1 });
salesSchema.index({ date: 1, category: 1 });
salesSchema.index({ date: 1, product: 1 });
salesSchema.index({ region: 1, category: 1 });

// Virtual for formatted date
salesSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Ensure virtuals are serialized
salesSchema.set('toJSON', { virtuals: true });
salesSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Sales', salesSchema); 