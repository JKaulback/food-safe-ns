import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const foodBankAPI = {
  // Search for food banks by location and filters
  searchFoodBanks: async (searchParams) => {
    try {
      const { location, radius = 50, allergens, cultural } = searchParams;
      
      console.log('🌐 Making API request to:', API_BASE_URL + '/api/search');
      
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (radius) params.append('radius', radius.toString());
      if (allergens && allergens.length > 0) {
        params.append('allergens', allergens.join(','));
      }
      if (cultural && cultural.length > 0) {
        params.append('cultural', cultural.join(','));
      }

      const response = await api.get(`/api/search?${params.toString()}`);
      console.log('✅ Search API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Search API error:', error);
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Network error: Unable to connect to server. Please ensure the backend server is running on port 3000.');
      }
      
      throw new Error(error.response?.data?.error || 'Failed to search food banks');
    }
  },

  // Get all food banks (for testing)
  getAllFoodBanks: async () => {
    try {
      const response = await api.get('/api/foodbanks');
      return response.data;
    } catch (error) {
      console.error('Get food banks API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch food banks');
    }
  },

  // Get a specific food bank by ID
  getFoodBankById: async (id) => {
    try {
      const response = await api.get(`/api/foodbanks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get food bank API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch food bank details');
    }
  },

  // Get inventory for a food bank
  getInventory: async (foodBankId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.allergens && filters.allergens.length > 0) {
        params.append('allergens', filters.allergens.join(','));
      }
      if (filters.category) {
        params.append('category', filters.category);
      }

      const queryString = params.toString();
      const url = `/api/inventory/${foodBankId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get inventory API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch inventory');
    }
  },

  // Get location suggestions for autocomplete
  getLocationSuggestions: async () => {
    try {
      const response = await api.get('/api/search/suggestions');
      return response.data;
    } catch (error) {
      console.error('Get suggestions API error:', error);
      throw new Error('Failed to fetch location suggestions');
    }
  },

  // Search by coordinates (for GPS location)
  searchByCoordinates: async (latitude, longitude, radius = 50) => {
    try {
      const response = await api.get(`/api/search/nearby/${latitude}/${longitude}?radius=${radius}`);
      return response.data;
    } catch (error) {
      console.error('Search by coordinates API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to search by location');
    }
  }
};

// Inventory management API (for food bank staff)
export const inventoryAPI = {
  // Add new inventory item
  addInventoryItem: async (foodBankId, itemData) => {
    try {
      const response = await api.post(`/api/inventory/${foodBankId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Add inventory API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to add inventory item');
    }
  },

  // Update inventory item
  updateInventoryItem: async (foodBankId, itemId, itemData) => {
    try {
      const response = await api.put(`/api/inventory/${foodBankId}/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Update inventory API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update inventory item');
    }
  },

  // Delete inventory item
  deleteInventoryItem: async (foodBankId, itemId) => {
    try {
      const response = await api.delete(`/api/inventory/${foodBankId}/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Delete inventory API error:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete inventory item');
    }
  }
};

// Utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.error || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Unable to connect to server';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  },

  // Format search results for display
  formatSearchResults: (searchResults) => {
    if (!searchResults || !searchResults.results) {
      return [];
    }

    return searchResults.results.foodBanks.map(foodBank => ({
      ...foodBank,
      tags: foodBank.tags || foodBank.services || ['Emergency Food', 'Community Support'], // Fallback tags
      formattedDistance: foodBank.distance ? `${foodBank.distance} km away` : '',
      formattedHours: foodBank.hours ? formatHours(foodBank.hours) : 'Hours not available',
      hours: typeof foodBank.hours === 'string' ? foodBank.hours : formatHours(foodBank.hours), // Ensure hours is always a string
      availabilityText: getAvailabilityText(foodBank.availabilityStatus, foodBank.inventoryCount)
    }));
  }
};

// Helper functions
const formatHours = (hours) => {
  if (typeof hours === 'string') return hours;
  
  if (!hours || typeof hours !== 'object') {
    return 'Hours not available';
  }
  
  // Get today's day name in full format (e.g., "monday", "tuesday")
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Try to get today's hours first
  if (hours[today]) {
    return `Today: ${hours[today]}`;
  }
  
  // If today's hours not available, show the first available day
  const firstDay = Object.keys(hours)[0];
  if (firstDay && hours[firstDay]) {
    return hours[firstDay];
  }
  
  return 'Hours not available';
};

const getAvailabilityText = (status, count) => {
  switch (status) {
    case 'high':
      return `${count} items available`;
    case 'moderate':
      return `${count} items - Good selection`;
    case 'low':
      return `${count} items - Limited selection`;
    case 'empty':
      return 'Currently out of stock';
    default:
      return `${count || 0} items`;
  }
};

export default api;