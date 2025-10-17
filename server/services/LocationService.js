const locationUtils = require('../utils/locationUtils');

/**
 * Service responsible for location-based operations
 * Single Responsibility: Location processing and geocoding
 */
class LocationService {
  
  /**
   * Parse and validate location input
   * @param {string} locationInput - User location input
   * @returns {object} - {success, coordinates, locationInfo, error}
   */
  parseLocation(locationInput) {
    try {
      const parsedLocation = locationUtils.parseLocation(locationInput);
      
      if (!parsedLocation) {
        return {
          success: false,
          error: 'Invalid location format. Please provide a valid Nova Scotia postal code or city name.',
          examples: ['B3K 5H6', 'Halifax', 'Sydney', 'Truro']
        };
      }
      
      return {
        success: true,
        coordinates: {
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude
        },
        locationInfo: {
          type: parsedLocation.type,
          originalInput: parsedLocation.originalInput,
          region: parsedLocation.region || null
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse location',
        details: error.message
      };
    }
  }

  /**
   * Get city information from coordinates
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {object} - City information
   */
  getCityFromCoordinates(latitude, longitude) {
    try {
      const cityInfo = locationUtils.coordinatesToCity(latitude, longitude);
      
      return {
        city: cityInfo ? cityInfo.city : 'Unknown Location',
        region: cityInfo ? cityInfo.region : 'Nova Scotia',
        found: !!cityInfo,
        distance: cityInfo ? cityInfo.distance : null
      };
    } catch (error) {
      return {
        city: 'Unknown Location',
        region: 'Nova Scotia',
        found: false,
        error: error.message
      };
    }
  }

  /**
   * Find food banks within radius of coordinates
   * @param {array} foodBanks - Array of food banks
   * @param {number} latitude - User latitude
   * @param {number} longitude - User longitude
   * @param {number} radius - Search radius in km
   * @returns {array} - Food banks with distance information
   */
  findNearbyFoodBanks(foodBanks, latitude, longitude, radius) {
    try {
      return locationUtils.findNearbyFoodBanks(foodBanks, latitude, longitude, radius);
    } catch (error) {
      console.error('Error finding nearby food banks:', error);
      return [];
    }
  }

  /**
   * Get location suggestions for autocomplete
   * @returns {object} - {cities, postalCodes}
   */
  getLocationSuggestions() {
    try {
      return locationUtils.getLocationSuggestions();
    } catch (error) {
      console.error('Error getting location suggestions:', error);
      return { cities: [], postalCodes: [] };
    }
  }

  /**
   * Get default coordinates (Halifax as fallback)
   * @returns {object} - Default coordinates
   */
  getDefaultCoordinates() {
    return {
      latitude: 44.6488,
      longitude: -63.5752
    };
  }

  /**
   * Calculate distance between two points
   * @param {number} lat1 - First point latitude
   * @param {number} lon1 - First point longitude
   * @param {number} lat2 - Second point latitude
   * @param {number} lon2 - Second point longitude
   * @returns {number} - Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    try {
      return locationUtils.calculateDistance(lat1, lon1, lat2, lon2);
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }
}

module.exports = LocationService;