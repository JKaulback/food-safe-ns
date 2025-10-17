/**
 * Service responsible for validating search parameters
 * Single Responsibility: Input validation only
 */
class SearchValidationService {
  
  /**
   * Validate location parameter
   * @param {string} location - Location input from user
   * @returns {object} - {isValid, error, examples}
   */
  validateLocation(location) {
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return {
        isValid: false,
        error: 'Location is required',
        examples: ['B3K 5H6', 'Halifax', 'Sydney', 'Truro']
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validate radius parameter
   * @param {string|number} radius - Search radius
   * @returns {object} - {isValid, error, value}
   */
  validateRadius(radius) {
    if (!radius) {
      return { isValid: true, value: 50 }; // Default value
    }
    
    const parsedRadius = parseInt(radius);
    
    if (isNaN(parsedRadius) || parsedRadius <= 0) {
      return {
        isValid: false,
        error: 'Invalid radius. Please provide a positive number in kilometers.',
        example: '25'
      };
    }
    
    if (parsedRadius > 500) {
      return {
        isValid: false,
        error: 'Radius too large. Maximum allowed is 500km.',
        example: '50'
      };
    }
    
    return { isValid: true, value: parsedRadius };
  }

  /**
   * Validate coordinates
   * @param {string|number} lat - Latitude
   * @param {string|number} lon - Longitude
   * @returns {object} - {isValid, error, coordinates}
   */
  validateCoordinates(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return {
        isValid: false,
        error: 'Invalid coordinates. Latitude and longitude must be valid numbers.'
      };
    }
    
    // Basic Nova Scotia bounds check
    if (latitude < 43.4 || latitude > 47.1 || longitude < -66.4 || longitude > -59.7) {
      return {
        isValid: false,
        error: 'Coordinates appear to be outside Nova Scotia bounds.'
      };
    }
    
    return { isValid: true, coordinates: { latitude, longitude } };
  }

  /**
   * Validate allergen filters
   * @param {string|array} allergens - Allergen filters
   * @returns {object} - {isValid, value}
   */
  validateAllergens(allergens) {
    if (!allergens) {
      return { isValid: true, value: null };
    }
    
    const allergenList = Array.isArray(allergens) ? allergens : [allergens];
    const validAllergens = [
      'dairy-free', 'gluten-free', 'nut-free', 'shellfish-free', 
      'egg-free', 'soy-free', 'sesame-free'
    ];
    
    const invalidAllergens = allergenList.filter(a => !validAllergens.includes(a));
    
    if (invalidAllergens.length > 0) {
      return {
        isValid: false,
        error: `Invalid allergen filters: ${invalidAllergens.join(', ')}`,
        validOptions: validAllergens
      };
    }
    
    return { isValid: true, value: allergenList };
  }

  /**
   * Validate cultural filters
   * @param {string|array} cultural - Cultural filters
   * @returns {object} - {isValid, value}
   */
  validateCultural(cultural) {
    if (!cultural) {
      return { isValid: true, value: null };
    }
    
    const culturalList = Array.isArray(cultural) ? cultural : [cultural];
    const validCultural = [
      'halal', 'kosher', 'vegan', 'vegetarian', 'indigenous', 
      'organic', 'low-sodium', 'diabetic-friendly'
    ];
    
    const invalidCultural = culturalList.filter(c => !validCultural.includes(c));
    
    if (invalidCultural.length > 0) {
      return {
        isValid: false,
        error: `Invalid cultural filters: ${invalidCultural.join(', ')}`,
        validOptions: validCultural
      };
    }
    
    return { isValid: true, value: culturalList };
  }
}

module.exports = SearchValidationService;