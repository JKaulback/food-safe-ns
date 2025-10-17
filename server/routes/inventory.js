require('express');
const router = express.Router();

// Sample data for food banks
const inventory = require('../data/sample-inventory.json');

// Get inventory items for a specific food bank
router.get('/:foodBankId', async (req, res) => {
  const { foodBankId } = req.params;
  const items = inventory.filter(item => item.foodBankId === foodBankId);
  res.json(items);
});

// Add a new inventory item
router.post('/:foodBankId', async (req, res) => {
  const { foodBankId } = req.params;
  const newItem = req.body;
  newItem.foodBankId = foodBankId;
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// Update quantity of an inventory item
router.put('/:foodBankId/:itemId', async (req, res) => {
  const { foodBankId, itemId } = req.params;
  const { quantity } = req.body;

  const item = inventory.find(item => item.foodBankId === foodBankId && item.id === itemId);
  if (item) {
    item.quantity = quantity;
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

module.exports = router;