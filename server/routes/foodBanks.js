const express = require('express');
const router = express.Router();
const foodBanks = require('../data/sample-food-banks.json');

// GET /api/foodbanks - Get all food banks
router.get('/', (req, res) => {
  try {
    res.json({
      results: {
        foodBanks: foodBanks,
        total: foodBanks.length
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: 'local-data'
      }
    });
  } catch (error) {
    console.error('Get food banks error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch food banks',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/foodbanks/:id - Get a specific food bank by ID
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;
    const foodBank = foodBanks.find(fb => fb.id === id);

    if (!foodBank) {
      return res.status(404).json({
        error: 'Food bank not found',
        timestamp: new Date().toISOString(),
        requestedId: id
      });
    }

    res.json(foodBank);
  } catch (error) {
    console.error('Get food bank error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch food bank details',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
