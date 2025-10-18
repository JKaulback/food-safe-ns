const inventoryData = require('../data/sample-inventory.json');
const openFoodFactsService = require('./OpenFoodFactsService');
const { enhanceWithStaticData } = require('../utils/staticProductImages');

/**
 * Service for managing food inventory operations
 * Follows Single Responsibility Principle - only handles inventory data
 */
class InventoryService {
  constructor() {
    this.inventory = inventoryData;
    this.enhancedCache = new Map(); // Cache for enhanced inventory items
  }

  /**
   * Get all inventory items for a specific food bank
   * @param {string} foodBankId - The food bank ID
   * @returns {array} Array of inventory items
   */
  getInventoryByFoodBank(foodBankId) {
    return this.inventory.filter(item => item.foodBankId === foodBankId);
  }

  /**
   * Get inventory count for a specific food bank
   * @param {string} foodBankId - The food bank ID
   * @returns {number} Total number of items in inventory
   */
  getInventoryCount(foodBankId) {
    return this.inventory.filter(item => item.foodBankId === foodBankId).length;
  }

  /**
   * Get total quantity of all items for a food bank
   * @param {string} foodBankId - The food bank ID
   * @returns {number} Total quantity of all items
   */
  getTotalQuantity(foodBankId) {
    return this.inventory
      .filter(item => item.foodBankId === foodBankId)
      .reduce((total, item) => total + (item.quantity || 0), 0);
  }

  /**
   * Get inventory summary for a food bank
   * @param {string} foodBankId - The food bank ID
   * @returns {object} Inventory summary with counts and categories
   */
  getInventorySummary(foodBankId) {
    const items = this.getInventoryByFoodBank(foodBankId);
    
    const summary = {
      totalItems: items.length,
      totalQuantity: items.reduce((total, item) => total + (item.quantity || 0), 0),
      categories: {},
      hasExpiringSoon: false,
      lowStockItems: []
    };

    // Group by categories and check for expiring/low stock items
    items.forEach(item => {
      // Category counts
      if (!summary.categories[item.category]) {
        summary.categories[item.category] = 0;
      }
      summary.categories[item.category] += item.quantity || 0;

      // Check for items expiring soon (within 30 days)
      const expiryDate = new Date(item.expiryDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      if (expiryDate <= thirtyDaysFromNow) {
        summary.hasExpiringSoon = true;
      }

      // Check for low stock (less than 10 items)
      if (item.quantity < 10) {
        summary.lowStockItems.push({
          name: item.name,
          quantity: item.quantity,
          category: item.category
        });
      }
    });

    return summary;
  }

  /**
   * Get inventory counts for multiple food banks
   * @param {array} foodBankIds - Array of food bank IDs
   * @returns {object} Object with foodBankId as key and count as value
   */
  getInventoryCountsForFoodBanks(foodBankIds) {
    const counts = {};
    
    foodBankIds.forEach(id => {
      counts[id] = this.getInventoryCount(id);
    });
    
    return counts;
  }

  /**
   * Get inventory summaries for multiple food banks
   * @param {array} foodBankIds - Array of food bank IDs
   * @returns {object} Object with foodBankId as key and summary as value
   */
  getInventorySummariesForFoodBanks(foodBankIds) {
    const summaries = {};
    
    foodBankIds.forEach(id => {
      summaries[id] = this.getInventorySummary(id);
    });
    
    return summaries;
  }

  /**
   * Filter inventory by allergens
   * @param {string} foodBankId - The food bank ID
   * @param {array} requiredAllergens - Array of required allergen-safe labels
   * @returns {array} Filtered inventory items
   */
  getInventoryByAllergens(foodBankId, requiredAllergens = []) {
    const items = this.getInventoryByFoodBank(foodBankId);
    
    if (!requiredAllergens.length) {
      return items;
    }
    
    return items.filter(item => {
      // Check if item has all required allergen-safe labels
      return requiredAllergens.every(allergen => 
        item.allergens && item.allergens.includes(allergen)
      );
    });
  }

  /**
   * Get available categories for a food bank
   * @param {string} foodBankId - The food bank ID
   * @returns {array} Array of unique categories
   */
  getAvailableCategories(foodBankId) {
    const items = this.getInventoryByFoodBank(foodBankId);
    return [...new Set(items.map(item => item.category))];
  }

  /**
   * Get enhanced inventory with OpenFoodFacts data and static fallbacks
   * @param {string} foodBankId - The food bank ID
   * @param {object} filters - Filter options (allergens, category)
   * @returns {Promise<array>} Enhanced inventory items with images and additional data
   */
  async getEnhancedInventory(foodBankId, filters = {}) {
    const baseItems = this.getFilteredInventory(foodBankId, filters);
    const enhancedItems = [];

    console.log(`🔧 Enhancing ${baseItems.length} inventory items for food bank ${foodBankId}`);

    for (const item of baseItems) {
      const cacheKey = `${item.id}_${item.name}_${item.brand}`;
      
      // Check cache first
      if (this.enhancedCache.has(cacheKey)) {
        enhancedItems.push(this.enhancedCache.get(cacheKey));
        continue;
      }

      try {
        let enhanced = item;

        // First try OpenFoodFacts API
        try {
          enhanced = await openFoodFactsService.enhanceInventoryItem(item);
        } catch (apiError) {
          console.log(`⚠️ OpenFoodFacts API failed for ${item.name}, trying static fallback`);
        }

        // If no image from API, try static mapping
        if (!enhanced.image) {
          enhanced = enhanceWithStaticData(enhanced);
        }

        // Add dietary tags from OpenFoodFacts if available
        if (enhanced.openFoodFactsData && enhanced.openFoodFactsData.labels) {
          const dietaryTags = openFoodFactsService.getDietaryTags(enhanced.openFoodFactsData.labels);
          enhanced.tags = [...(enhanced.tags || []), ...dietaryTags];
          // Remove duplicates
          enhanced.tags = [...new Set(enhanced.tags)];
        }

        // Cache the enhanced item
        this.enhancedCache.set(cacheKey, enhanced);
        enhancedItems.push(enhanced);
      } catch (error) {
        console.error(`❌ Error enhancing item ${item.name}:`, error.message);
        // Fall back to original item if enhancement fails
        enhancedItems.push(item);
      }
    }

    console.log(`✅ Enhanced ${enhancedItems.length} inventory items`);
    return enhancedItems;
  }

  /**
   * Clear the enhancement cache (useful for testing or cache refresh)
   */
  clearEnhancementCache() {
    this.enhancedCache.clear();
  }
}

module.exports = InventoryService;