const express = require('express');
const router = express.Router();
const InventoryService = require('../services/InventoryService');

// Sample data for food banks
const inventory = require('../data/sample-inventory.json');

// Get inventory items for a specific food bank with enhanced data
router.get('/:foodBankId', async (req, res) => {
  try {
    const { foodBankId } = req.params;
    const { allergens, category, enhanced } = req.query;
    
    console.log(`📦 Getting inventory for food bank: ${foodBankId}`);
    
    // Parse allergens if provided
    const allergenFilter = allergens ? allergens.split(',') : [];
    
    const filters = {
      allergens: allergenFilter,
      category: category || undefined
    };

    // Use enhanced data if requested (default to true for better UX)
    const useEnhanced = enhanced !== 'false';
    
    let items;
    if (useEnhanced) {
      console.log('🔧 Using enhanced inventory with OpenFoodFacts data');
      // Get enhanced inventory with OpenFoodFacts data
      const inventoryService = new InventoryService();
      items = await inventoryService.getEnhancedInventory(foodBankId, filters);
    } else {
      console.log('📋 Using basic inventory data');
      // Get basic filtered inventory
      const inventoryService = new InventoryService();
      items = inventoryService.getFilteredInventory(foodBankId, filters);
    }

    console.log(`✅ Returning ${items.length} inventory items`);
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching inventory:', error);
    // Fallback to basic inventory if enhancement fails
    const { foodBankId } = req.params;
    const items = inventory.filter(item => item.foodBankId === foodBankId);
    console.log(`⚠️ Fallback: returning ${items.length} basic inventory items`);
    res.json(items);
  }
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