/**
 * Service responsible for filtering food banks
 * Single Responsibility: Filter logic only
 */
class FoodBankFilterService {
  
  /**
   * Filter food banks by allergen requirements
   * @param {array} foodBanks - Array of food banks
   * @param {array} allergens - Array of allergen requirements
   * @returns {array} - Filtered food banks with allergen info
   */
  filterByAllergens(foodBanks, allergens) {
    if (!allergens || allergens.length === 0) {
      return foodBanks;
    }
    
    return foodBanks.map(foodBank => ({
      ...foodBank,
      allergenInfo: {
        hasAllergenFreeOptions: this._checkAllergenAccommodations(foodBank, allergens),
        supportedAllergens: this._getSupportedAllergens(foodBank, allergens)
      }
    }));
  }

  /**
   * Filter food banks by cultural requirements
   * @param {array} foodBanks - Array of food banks
   * @param {array} cultural - Array of cultural requirements
   * @returns {array} - Filtered food banks
   */
  filterByCultural(foodBanks, cultural) {
    if (!cultural || cultural.length === 0) {
      return foodBanks;
    }
    
    return foodBanks.filter(foodBank => 
      this._hasCulturalAccommodations(foodBank, cultural)
    );
  }

  /**
   * Filter food banks by distance
   * @param {array} foodBanks - Array of food banks with distance
   * @param {number} maxDistance - Maximum distance in km
   * @returns {array} - Filtered food banks
   */
  filterByDistance(foodBanks, maxDistance) {
    return foodBanks.filter(foodBank => 
      foodBank.distance <= maxDistance
    );
  }

  /**
   * Sort food banks by distance (closest first)
   * @param {array} foodBanks - Array of food banks
   * @returns {array} - Sorted food banks
   */
  sortByDistance(foodBanks) {
    return foodBanks.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Apply all filters and sorting
   * @param {array} foodBanks - Array of food banks
   * @param {object} filters - Filter criteria {allergens, cultural, maxDistance}
   * @returns {array} - Filtered and sorted food banks
   */
  applyAllFilters(foodBanks, filters = {}) {
    let result = [...foodBanks];
    
    // Apply distance filter
    if (filters.maxDistance) {
      result = this.filterByDistance(result, filters.maxDistance);
    }
    
    // Apply cultural filter (strict - removes non-matching)
    if (filters.cultural) {
      result = this.filterByCultural(result, filters.cultural);
    }
    
    // Apply allergen filter (adds info - doesn't remove)
    if (filters.allergens) {
      result = this.filterByAllergens(result, filters.allergens);
    }
    
    // Sort by distance
    result = this.sortByDistance(result);
    
    return result;
  }

  /**
   * Private method to check allergen accommodations
   * @private
   */
  _checkAllergenAccommodations(foodBank, allergens) {
    if (!foodBank.culturalAccommodations) return false;
    
    return allergens.some(allergen => 
      foodBank.culturalAccommodations.some(accommodation => 
        accommodation.includes(allergen.replace('-free', ''))
      )
    );
  }

  /**
   * Private method to get supported allergens
   * @private
   */
  _getSupportedAllergens(foodBank, allergens) {
    if (!foodBank.culturalAccommodations) return [];
    
    return allergens.filter(allergen => 
      foodBank.culturalAccommodations.some(accommodation => 
        accommodation.includes(allergen.replace('-free', ''))
      )
    );
  }

  /**
   * Private method to check cultural accommodations
   * @private
   */
  _hasCulturalAccommodations(foodBank, cultural) {
    if (!foodBank.culturalAccommodations) return false;
    
    return cultural.some(culture => 
      foodBank.culturalAccommodations.includes(culture)
    );
  }
}

module.exports = FoodBankFilterService;