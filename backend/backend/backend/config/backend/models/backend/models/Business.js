const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add business name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Fundi Simu', 'Mjenzi', 'Dereva', 'Daktari', 
      'Mpiga Picha', 'Fundi Umeme', 'Fundi Mabomba',
      'Mwalimu', 'Mshauri', 'Mpishi', 'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'featured', 'premium'],
    default: 'free'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  workingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
BusinessSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  location: 'text'
});

module.exports = mongoose.model('Business', BusinessSchema);
