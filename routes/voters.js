const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');

// Get all voters with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const voters = await Voter.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Voter.countDocuments();
    res.json({
      voters,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one voter
router.get('/:id', getVoter, (req, res) => {
  res.json(res.voter);
});

// Update one voter
router.patch('/:id', getVoter, async (req, res) => {
  if (req.body.mobileNumber != null) {
    res.voter.mobileNumber = req.body.mobileNumber;
  }
  // Add other fields to update here
  try {
    const updatedVoter = await res.voter.save();
    res.json(updatedVoter);
  } catch (err)
 {
    res.status(400).json({ message: err.message });
  }
});

async function getVoter(req, res, next) {
  let voter;
  try {
    voter = await Voter.findById(req.params.id);
    if (voter == null) {
      return res.status(404).json({ message: 'Cannot find voter' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.voter = voter;
  next();
}

module.exports = router;
