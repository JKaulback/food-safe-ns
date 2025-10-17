const express = require('express');
const FoodBankSearchService = require('../services/FoodBankSearchService');

const router = express.Router();
const foodBanks = require('../data/sample-food-banks.json');

// Initialize search service
const searchService = new FoodBankSearchService();

// GET /api/search - Search for food banks by location
router.get('/', async (req, res) => {
  try {
    const searchParams = {
      location: req.query.location,
      radius: req.query.radius,
      allergens: req.query.allergens,
      cultural: req.query.cultural
    };

    const searchResults = await searchService.search(searchParams, foodBanks);
    res.json(searchResults);

  } catch (error) {
    console.error('Search error:', error);
    
    // Return structured error response
    res.status(400).json({ 
      error: error.message || 'Search failed',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    });
  }
});

// GET /api/search/suggestions - Get location suggestions for autocomplete
router.get('/suggestions', (req, res) => {
  try {
    const suggestions = searchService.getLocationSuggestions();
    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to load location suggestions',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/search/nearby/:lat/:lon - Search by exact coordinates
router.get('/nearby/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const { radius } = req.query;
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    const results = await searchService.searchByCoordinates(
      latitude, 
      longitude, 
      radius, 
      foodBanks
    );
    
    res.json(results);
    
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to search nearby food banks',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    });
  }
});

module.exports = router;