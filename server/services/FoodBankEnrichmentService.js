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

    // Always add tags for consistency
    enrichedFoodBank.tags = this._generateTagsForFoodBank(foodBank);

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
        totalQuantity: this.inventoryService.getTotalQuantity(foodBank.id),
        tags: this._generateTagsForFoodBank(foodBank)
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

  /**
   * Generate relevant tags for a food bank based on its inventory
   * @private
   */
  _generateTagsForFoodBank(foodBank) {
    const tags = ['Emergency Food']; // Default tag
    
    try {
      const inventory = this.inventoryService.getInventoryByFoodBank(foodBank.id);
      const categories = new Set();
      const allergenFree = new Set();
      
      inventory.forEach(item => {
        // Add categories
        if (item.category) {
          categories.add(item.category);
        }
        
        // Check for allergen-free items
        if (!item.allergens || item.allergens.length === 0) {
          allergenFree.add('Allergen-Free Options');
        } else {
          // Check for specific allergen-free categories
          if (!item.allergens.includes('gluten')) allergenFree.add('Gluten-Free');
          if (!item.allergens.includes('dairy')) allergenFree.add('Dairy-Free');
          if (!item.allergens.includes('nuts')) allergenFree.add('Nut-Free');
        }
      });
      
      // Add category tags
      categories.forEach(category => {
        switch (category) {
          case 'fresh-produce':
            tags.push('Fresh Produce');
            break;
          case 'canned-goods':
            tags.push('Canned Goods');
            break;
          case 'dairy':
            tags.push('Dairy Products');
            break;
          case 'meat':
            tags.push('Meat & Protein');
            break;
          case 'grains':
            tags.push('Grains & Bread');
            break;
          case 'frozen':
            tags.push('Frozen Items');
            break;
        }
      });
      
      // Add allergen-free tags
      allergenFree.forEach(tag => tags.push(tag));
      
      // Add cultural/religious tags if applicable
      if (foodBank.city === 'Halifax' && inventory.length > 50) {
        tags.push('Halal Options');
      }
      
      return tags.slice(0, 8); // Limit to 8 tags
      
    } catch (error) {
      console.error('Error generating tags for food bank:', error);
      return ['Emergency Food', 'Community Support'];
    }
  }
}

module.exports = FoodBankEnrichmentService;