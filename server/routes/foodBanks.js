require('express');
const router = express.Router();
const FoodBankController = require('../controllers/FoodBankController');

// Sample data for food banks
const foodBanks = require('../data/sample-food-banks.json');

// GET /api/foodbanks - Retrieve all food banks based on location requested
router.get('/', async (req, res) => {
  let { location, radius } = req.query;
  // Default location to first food bank's location if not provided
  if (!location) {
    location = foodBanks[0].coordinates;
  }

  // Make sure location is in the correct format
  if (typeof location === 'string') {
    location = JSON.parse(location);
  }

  // Default radius to 15km if not provided
  if (!radius) {
    radius = 15;
  }

  // Filter food banks by location in specified radius
  const filteredFoodBanks = await FoodBankController.filterByLocation(foodBanks, location, radius);

  res.json(filteredFoodBanks);
});

module.exports = router;