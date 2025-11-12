const express = require('express');
const router = express.Router();
const Voter = require('../models/voter');

// Route to filter voterlist based on multiple fields as filters
router.get('/filter', async (req, res) => {
  const filters = {};
  // Accept any field from query and add to filters if present
  const allowedFields = [
    "Assembly Constituency No", "Assembly Constituency Name", "Reservation Status",
    "Part No", "Section Name", "Polling Station No", "Polling Station Name",
    "Polling Station Address", "Serial No", "EPIC No", "Name", "Relation Name",
    "Relation Type", "House No", "Age", "Gender", "Photo Available", "mobileNumber"
  ];
  allowedFields.forEach(field => {
    if (req.query[field] != null) {
      if (field === "Name") {
        // Use case-insensitive partial match for Name
        filters["Name"] = { $regex: req.query["Name"], $options: "i" };
      } else {
        filters[field] = req.query[field];
      }
    }
  });
  const { page = 1, limit = 10 } = req.query;
  try {
    const voters = await Voter.find(filters)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Voter.countDocuments(filters);
    res.json({
      voters,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all voters who have mobile number present
router.get('/with-mobile', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const voters = await Voter.find({ mobileNumber: { $exists: true, $ne: "" } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Voter.countDocuments({ mobileNumber: { $exists: true, $ne: "" } });
    res.json({
      voters,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

// Search for voters by name
router.get('/search/:name', async (req, res) => {
      const { name } = req.params;
      const { page = 1, limit = 10 } = req.query;
      try {
        const voters = await Voter.find({ "Name": { $regex: name, $options: 'i' } })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();
        const count = await Voter.countDocuments({ "Name": { $regex: name, $options: 'i' } });
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
