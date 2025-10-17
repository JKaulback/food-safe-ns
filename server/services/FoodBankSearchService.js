const SearchValidationService = require('./SearchValidationService');
const LocationService = require('./LocationService');
const FoodBankFilterService = require('./FoodBankFilterService');
const FoodBankEnrichmentService = require('./FoodBankEnrichmentService');

/**
 * Main search service that orchestrates the search process
 * Single Responsibility: Coordinate search operations
 * Open/Closed Principle: Open for extension, closed for modification
 */
class FoodBankSearchService {
  
  constructor() {
    this.validationService = new SearchValidationService();
    this.locationService = new LocationService();
    this.filterService = new FoodBankFilterService();
    this.enrichmentService = new FoodBankEnrichmentService();
  }

  /**
   * Perform a comprehensive food bank search
   * @param {object} searchParams - {location, radius, allergens, cultural}
   * @param {array} foodBanks - Array of available food banks
   * @returns {object} - Search results with metadata
   */
  async search(searchParams, foodBanks) {
    const { location, radius, allergens, cultural } = searchParams;
    
    // Step 1: Validate all inputs
    const validation = this._validateSearchParams(searchParams);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Step 2: Process location
    const locationResult = this._processLocation(location);
    if (!locationResult.success) {
      throw new Error(locationResult.error);
    }

    // Step 3: Find nearby food banks
    const nearbyFoodBanks = this.locationService.findNearbyFoodBanks(
      foodBanks,
      locationResult.coordinates.latitude,
      locationResult.coordinates.longitude,
      validation.radius
    );

    // Step 4: Apply filters
    const filteredFoodBanks = this.filterService.applyAllFilters(nearbyFoodBanks, {
      allergens: validation.allergens,
      cultural: validation.cultural,
      maxDistance: validation.radius
    });

    // Step 5: Enrich food banks with inventory information
    const enrichedFoodBanks = this.enrichmentService.enrichFoodBanksWithInventory(
      filteredFoodBanks,
      {
        includeInventoryCount: true,
        includeInventorySummary: true,
        includeCategories: true,
        includeAllergenInfo: true
      }
    );

    // Step 6: Add availability status
    const foodBanksWithAvailability = this.enrichmentService.addAvailabilityStatus(
      enrichedFoodBanks
    );

    // Step 7: Get location info for response
    const cityInfo = this.locationService.getCityFromCoordinates(
      locationResult.coordinates.latitude,
      locationResult.coordinates.longitude
    );

    // Step 8: Build comprehensive response
    return this._buildSearchResponse(
      searchParams,
      locationResult,
      cityInfo,
      validation,
      foodBanksWithAvailability
    );
  }

  /**
   * Search by exact coordinates
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate  
   * @param {number} radius - Search radius
   * @param {array} foodBanks - Array of food banks
   * @returns {object} - Search results
   */
  async searchByCoordinates(latitude, longitude, radius, foodBanks) {
    // Validate coordinates
    const coordValidation = this.validationService.validateCoordinates(latitude, longitude);
    if (!coordValidation.isValid) {
      throw new Error(coordValidation.error);
    }

    // Validate radius
    const radiusValidation = this.validationService.validateRadius(radius);
    if (!radiusValidation.isValid) {
      throw new Error(radiusValidation.error);
    }

    // Find nearby food banks
    const nearbyFoodBanks = this.locationService.findNearbyFoodBanks(
      foodBanks,
      latitude,
      longitude,
      radiusValidation.value
    );

    // Enrich with inventory information
    const enrichedFoodBanks = this.enrichmentService.enrichFoodBanksWithInventory(
      nearbyFoodBanks,
      {
        includeInventoryCount: true,
        includeInventorySummary: false,
        includeCategories: false,
        includeAllergenInfo: false
      }
    );

    // Add availability status
    const foodBanksWithAvailability = this.enrichmentService.addAvailabilityStatus(
      enrichedFoodBanks
    );

    // Get city information
    const cityInfo = this.locationService.getCityFromCoordinates(latitude, longitude);

    return {
      coordinates: { latitude, longitude },
      locationInfo: cityInfo,
      radius: radiusValidation.value,
      results: {
        totalFound: foodBanksWithAvailability.length,
        foodBanks: foodBanksWithAvailability
      }
    };
  }

  /**
   * Get location suggestions for autocomplete
   * @returns {object} - Location suggestions
   */
  getLocationSuggestions() {
    return this.locationService.getLocationSuggestions();
  }

  /**
   * Private method to validate search parameters
   * @private
   */
  _validateSearchParams(params) {
    const { location, radius, allergens, cultural } = params;
    
    // Validate radius
    const radiusValidation = this.validationService.validateRadius(radius);
    if (!radiusValidation.isValid) {
      return radiusValidation;
    }

    // Validate allergens
    const allergenValidation = this.validationService.validateAllergens(allergens);
    if (!allergenValidation.isValid) {
      return allergenValidation;
    }

    // Validate cultural filters
    const culturalValidation = this.validationService.validateCultural(cultural);
    if (!culturalValidation.isValid) {
      return culturalValidation;
    }

    return {
      isValid: true,
      radius: radiusValidation.value,
      allergens: allergenValidation.value,
      cultural: culturalValidation.value
    };
  }

  /**
   * Private method to process location input
   * @private
   */
  _processLocation(location) {
    if (!location) {
      // Use default coordinates (Halifax)
      const defaultCoords = this.locationService.getDefaultCoordinates();
      return {
        success: true,
        coordinates: defaultCoords,
        isDefault: true
      };
    }

    return this.locationService.parseLocation(location);
  }

  /**
   * Private method to build search response
   * @private
   */
  _buildSearchResponse(searchParams, locationResult, cityInfo, validation, foodBanks) {
    return {
      searchCriteria: {
        location: searchParams.location || 'Default (Halifax)',
        coordinates: locationResult.coordinates,
        radius: validation.radius,
        allergens: validation.allergens,
        cultural: validation.cultural
      },
      locationInfo: {
        city: cityInfo.city,
        region: cityInfo.region,
        found: locationResult.isDefault ? false : cityInfo.found,
        isDefault: locationResult.isDefault || false
      },
      results: {
        totalFound: foodBanks.length,
        foodBanks: foodBanks
      }
    };
  }
}

module.exports = FoodBankSearchService;