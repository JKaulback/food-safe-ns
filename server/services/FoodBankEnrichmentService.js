const InventoryService = require('./InventoryService');

/**
 * Service for enriching food bank data with additional information
 * Follows Single Responsibility Principle - only handles data enrichment
 */
class FoodBankEnrichmentService {
  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Enrich a single food bank with inventory information
   * @param {object} foodBank - The food bank object
   * @param {object} options - Enrichment options
   * @returns {object} Enriched food bank object
   */
  enrichFoodBankWithInventory(foodBank, options = {}) {
    const {
      includeInventoryCount = true,
      includeInventorySummary = false,
      includeCategories = false,
      includeAllergenInfo = false
    } = options;

    const enrichedFoodBank = { ...foodBank };

    if (includeInventoryCount) {
      enrichedFoodBank.inventoryCount = this.inventoryService.getInventoryCount(foodBank.id);
      enrichedFoodBank.totalQuantity = this.inventoryService.getTotalQuantity(foodBank.id);
    }

    if (includeInventorySummary) {
      enrichedFoodBank.inventorySummary = this.inventoryService.getInventorySummary(foodBank.id);
    }

    if (includeCategories) {
      enrichedFoodBank.availableCategories = this.inventoryService.getAvailableCategories(foodBank.id);
    }

    if (includeAllergenInfo) {
      // Get all allergen-safe options available at this food bank
      const inventory = this.inventoryService.getInventoryByFoodBank(foodBank.id);
      const allergenOptions = new Set();
      
      inventory.forEach(item => {
        if (item.allergens) {
          item.allergens.forEach(allergen => allergenOptions.add(allergen));
        }
      });
      
      enrichedFoodBank.availableAllergenOptions = Array.from(allergenOptions);
    }

    return enrichedFoodBank;
  }

  /**
   * Enrich multiple food banks with inventory information
   * @param {array} foodBanks - Array of food bank objects
   * @param {object} options - Enrichment options
   * @returns {array} Array of enriched food bank objects
   */
  enrichFoodBanksWithInventory(foodBanks, options = {}) {
    if (!Array.isArray(foodBanks)) {
      return [];
    }

    // For performance, get all counts at once if we're only adding counts
    if (options.includeInventoryCount && !options.includeInventorySummary) {
      const foodBankIds = foodBanks.map(fb => fb.id);
      const inventoryCounts = this.inventoryService.getInventoryCountsForFoodBanks(foodBankIds);
      
      return foodBanks.map(foodBank => ({
        ...foodBank,
        inventoryCount: inventoryCounts[foodBank.id] || 0,
        totalQuantity: this.inventoryService.getTotalQuantity(foodBank.id)
      }));
    }

    // For more complex enrichment, process each food bank individually
    return foodBanks.map(foodBank => 
      this.enrichFoodBankWithInventory(foodBank, options)
    );
  }

  /**
   * Add availability status to food banks based on inventory
   * @param {array} foodBanks - Array of food bank objects
   * @returns {array} Food banks with availability status
   */
  addAvailabilityStatus(foodBanks) {
    return foodBanks.map(foodBank => {
      const inventoryCount = this.inventoryService.getInventoryCount(foodBank.id);
      const totalQuantity = this.inventoryService.getTotalQuantity(foodBank.id);
      
      let availabilityStatus = 'unknown';
      let availabilityMessage = 'Inventory status unknown';
      
      if (totalQuantity === 0) {
        availabilityStatus = 'empty';
        availabilityMessage = 'No items currently available';
      } else if (totalQuantity < 50) {
        availabilityStatus = 'low';
        availabilityMessage = 'Limited items available';
      } else if (totalQuantity < 200) {
        availabilityStatus = 'moderate';
        availabilityMessage = 'Good selection available';
      } else {
        availabilityStatus = 'high';
        availabilityMessage = 'Wide selection available';
      }

      return {
        ...foodBank,
        inventoryCount,
        totalQuantity,
        availabilityStatus,
        availabilityMessage
      };
    });
  }

  /**
   * Filter food banks by inventory availability
   * @param {array} foodBanks - Array of food bank objects
   * @param {string} minAvailability - Minimum availability level (empty, low, moderate, high)
   * @returns {array} Filtered food banks
   */
  filterByAvailability(foodBanks, minAvailability = 'low') {
    const availabilityLevels = {
      'empty': 0,
      'low': 1,
      'moderate': 2,
      'high': 3
    };

    const minLevel = availabilityLevels[minAvailability] || 1;
    
    return foodBanks.filter(foodBank => {
      const totalQuantity = this.inventoryService.getTotalQuantity(foodBank.id);
      
      if (totalQuantity === 0) return minLevel <= 0;
      if (totalQuantity < 50) return minLevel <= 1;
      if (totalQuantity < 200) return minLevel <= 2;
      return minLevel <= 3;
    });
  }
}

module.exports = FoodBankEnrichmentService;