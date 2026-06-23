const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all businesses with search & filters
// @route   GET /api/businesses
router.get('/', async (req, res) => {
  try {
    const { 
      q, 
      category, 
      location, 
      minRating, 
      page = 1, 
      limit = 10,
      subscription 
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Rating filter
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Subscription filter
    if (subscription) {
      query.subscriptionPlan = subscription;
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const total = await Business.countDocuments(query);

    // Sort order: premium first, then featured, then free
    const sortOrder = {
      subscriptionPlan: {
        premium: 0,
        featured: 1,
        free: 2
      }
    };

    const businesses = await Business.find(query)
      .sort({ 
        subscriptionPlan: -1, 
        averageRating: -1,
        createdAt: -1 
      })
      .limit(parseInt(limit))
      .skip(startIndex)
      .populate('owner', 'name email phone');

    res.json({
      success: true,
      count: businesses.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      businesses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single business
// @route   GET /api/businesses/:id
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Increment views
    business.views += 1;
    await business.save();

    // Get reviews for this business
    const reviews = await Review.find({ business: business._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      business,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new business listing
// @route   POST /api/businesses
router.post('/', protect, async (req, res) => {
  try {
    // Add owner to request body
    req.body.owner = req.user.id;

    // Check if user already has a business
    const existingBusiness = await Business.findOne({ owner: req.user.id });
    if (existingBusiness && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'You already have a business listing' 
      });
    }

    const business = await Business.create(req.body);

    // Update user role to business_owner
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { role: 'business_owner' });

    res.status(201).json({
      success: true,
      business
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update business
// @route   PUT /api/businesses/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check ownership
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Not authorized to update this business' 
      });
    }

    business = await Business.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      business
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete business
// @route   DELETE /api/businesses/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check ownership
    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Not authorized to delete this business' 
      });
    }

    await business.remove();

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add review to business
// @route   POST /api/businesses/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const businessId = req.params.id;

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ 
      business: businessId, 
      user: req.user.id 
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'You already reviewed this business' 
      });
    }

    const review = await Review.create({
      business: businessId,
      user: req.user.id,
      rating,
      comment
    });

    // Update business average rating
    const reviews = await Review.find({ business: businessId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Business.findByIdAndUpdate(businessId, {
      averageRating: averageRating.toFixed(1),
      reviewsCount: reviews.length
    });

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
