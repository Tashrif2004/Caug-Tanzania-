const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect } = require('../middleware/auth');

// @desc    Upgrade subscription plan
// @route   PUT /api/subscriptions/upgrade
router.put('/upgrade', protect, async (req, res) => {
  try {
    const { plan } = req.body; // 'featured' or 'premium'
    
    if (!['featured', 'premium'].includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const business = await Business.findOne({ owner: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // In production, you would process payment here
    // For now, we'll just upgrade the plan

    business.subscriptionPlan = plan;
    
    // If premium, auto-verify
    if (plan === 'premium') {
      business.isVerified = true;
    }

    await business.save();

    res.json({
      success: true,
      message: `Upgraded to ${plan} plan successfully`,
      business
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current subscription status
// @route   GET /api/subscriptions/status
router.get('/status', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });
    
    if (!business) {
      return res.status(404).json({ message: 'No business found' });
    }

    res.json({
      success: true,
      plan: business.subscriptionPlan,
      isVerified: business.isVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
