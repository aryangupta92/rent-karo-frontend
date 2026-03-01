const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Furniture', 'Tools', 'Appliances', 'Camping', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    // Default placeholder if no image provided
    default: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000'
  },
  location: {
    type: String,
    required: true
  },
  owner: {
    type: String, // For now, we'll just store the owner's name string until we add Auth
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;