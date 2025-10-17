const postalCodeMappings = require('../data/postal-code-mappings.json');

/**
 * Convert a Nova Scotia postal code to coordinates
 * @param {string} postalCode - The postal code (e.g., "B3K 5H6" or "B3K")
 * @returns {object|null} - {latitude, longitude, region} or null if not found
 */
function postalCodeToCoordinates(postalCode) {
  if (!postalCode) return null;
  
  // Clean the postal code - remove spaces and convert to uppercase
  const cleanCode = postalCode.replace(/\s+/g, '').toUpperCase();
  
  // Try exact match first (for 6-character codes)
  if (cleanCode.length >= 3) {
    // Extract first 3 characters (Forward Sortation Area)
    const fsa = cleanCode.substring(0, 3);
    
    if (postalCodeMappings.postalCodeMappings[fsa]) {
      return postalCodeMappings.postalCodeMappings[fsa];
    }
  }
  
  return null;
}

/**
 * Convert a city name to coordinates
 * @param {string} cityName - The city name (e.g., "Halifax", "Sydney")
 * @returns {object|null} - {latitude, longitude, postalCodes} or null if not found
 */
function cityToCoordinates(cityName) {
  if (!cityName) return null;
  
  const cleanCity = cityName.toLowerCase().trim();
  
  if (postalCodeMappings.cityMappings[cleanCity]) {
    return postalCodeMappings.cityMappings[cleanCity];
  }
  
  return null;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Parse location input and return coordinates
 * Handles both postal codes and city names
 * @param {string} locationInput - User input (postal code or city name)
 * @returns {object|null} - {latitude, longitude, type, originalInput} or null
 */
function parseLocation(locationInput) {
  if (!locationInput) return null;
  
  const input = locationInput.trim();
  
  // Check if it looks like a postal code (starts with letter, has numbers)
  const postalCodePattern = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  const partialPostalPattern = /^[A-Z]\d[A-Z]$/i;
  
  if (postalCodePattern.test(input) || partialPostalPattern.test(input)) {
    const coords = postalCodeToCoordinates(input);
    if (coords) {
      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        region: coords.region,
        type: 'postal_code',
        originalInput: input
      };
    }
  }
  
  // Try as city name
  const coords = cityToCoordinates(input);
  if (coords) {
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      postalCodes: coords.postalCodes,
      type: 'city',
      originalInput: input
    };
  }
  
  return null;
}

/**
 * Find food banks within a given radius of a location
 * @param {array} foodBanks - Array of food bank objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} radiusKm - Search radius in kilometers (default: 50)
 * @returns {array} - Array of food banks with distance added
 */
function findNearbyFoodBanks(foodBanks, userLat, userLon, radiusKm = 50) {
  if (!foodBanks || !Array.isArray(foodBanks)) return [];
  
  return foodBanks
    .map(foodBank => {
      if (!foodBank.coordinates) return null;
      
      const distance = calculateDistance(
        userLat, 
        userLon, 
        foodBank.coordinates.latitude, 
        foodBank.coordinates.longitude
      );
      
      return {
        ...foodBank,
        distance: distance
      };
    })
    .filter(foodBank => foodBank && foodBank.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Convert coordinates to the nearest city name (reverse geocoding)
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @param {number} maxDistance - Maximum distance to search (default: 50km)
 * @returns {object|null} - {city, distance, region} or null if not found
 */
function coordinatesToCity(latitude, longitude, maxDistance = 50) {
  if (!latitude || !longitude) return null;
  
  let nearestCity = null;
  let nearestDistance = Infinity;
  
  // Check all cities in our mapping
  for (const [cityName, cityData] of Object.entries(postalCodeMappings.cityMappings)) {
    const distance = calculateDistance(
      latitude, 
      longitude, 
      cityData.latitude, 
      cityData.longitude
    );
    
    if (distance < nearestDistance && distance <= maxDistance) {
      nearestDistance = distance;
      nearestCity = {
        city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
        distance: distance,
        region: cityData.region || 'Nova Scotia',
        coordinates: {
          latitude: cityData.latitude,
          longitude: cityData.longitude
        }
      };
    }
  }
  
  // If no city found in city mappings, check postal code regions
  if (!nearestCity) {
    for (const [postalCode, postalData] of Object.entries(postalCodeMappings.postalCodeMappings)) {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        postalData.latitude, 
        postalData.longitude
      );
      
      if (distance < nearestDistance && distance <= maxDistance) {
        nearestDistance = distance;
        nearestCity = {
          city: postalData.region,
          distance: distance,
          region: postalData.region,
          postalCode: postalCode,
          coordinates: {
            latitude: postalData.latitude,
            longitude: postalData.longitude
          }
        };
      }
    }
  }
  
  return nearestCity;
}

/**
 * Get detailed location info from coordinates
 * @param {number} latitude - The latitude coordinate
 * @param {number} longitude - The longitude coordinate
 * @returns {object} - Detailed location information
 */
function getLocationDetails(latitude, longitude) {
  const cityInfo = coordinatesToCity(latitude, longitude);
  
  if (!cityInfo) {
    return {
      city: 'Unknown Location',
      region: 'Nova Scotia',
      distance: null,
      coordinates: { latitude, longitude },
      found: false
    };
  }
  
  return {
    ...cityInfo,
    found: true
  };
}

/**
 * Get suggested locations for autocomplete
 * @returns {array} - Array of location suggestions
 */
function getLocationSuggestions() {
  const cities = Object.keys(postalCodeMappings.cityMappings);
  const postalCodes = Object.keys(postalCodeMappings.postalCodeMappings);
  
  return {
    cities: cities.map(city => ({
      name: city.charAt(0).toUpperCase() + city.slice(1),
      type: 'city',
      value: city
    })),
    postalCodes: postalCodes.map(code => ({
      name: code,
      type: 'postal_code', 
      value: code
    }))
  };
}

module.exports = {
  postalCodeToCoordinates,
  cityToCoordinates,
  coordinatesToCity,
  getLocationDetails,
  calculateDistance,
  parseLocation,
  findNearbyFoodBanks,
  getLocationSuggestions
};
