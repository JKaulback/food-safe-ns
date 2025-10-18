/**
 * Utility functions for handling product images and OpenFoodFacts integration
 */

/**
 * Get the best available image for a product
 * @param {Object} item - Inventory item
 * @returns {string|null} - Image URL or null
 */
export const getProductImage = (item) => {
  // Priority order: OpenFoodFacts image > manual image > placeholder
  if (item.image && !item.image.includes('placeholder')) {
    return item.image;
  }
  
  if (item.openFoodFactsData?.image) {
    return item.openFoodFactsData.image;
  }
  
  return null;
};

/**
 * Get enhanced allergen information
 * @param {Object} item - Inventory item
 * @returns {Array} - Combined allergen list
 */
export const getAllergens = (item) => {
  const baseAllergens = item.allergens || [];
  const offAllergens = item.openFoodFactsData?.allergens || [];
  
  // Combine and deduplicate allergens
  const combined = [...baseAllergens, ...offAllergens];
  return [...new Set(combined)];
};

/**
 * Check if two allergens are synonyms (e.g., 'milk' and 'dairy')
 * @param {string} allergen1 - First allergen
 * @param {string} allergen2 - Second allergen  
 * @returns {boolean} - Whether the allergens are synonyms
 */
export const areAllergensSynonyms = (allergen1, allergen2) => {
  const allergenSynonyms = {
    'dairy': ['milk', 'dairy'],
    'milk': ['milk', 'dairy'],
    'nuts': ['nuts', 'tree-nuts'],
    'tree-nuts': ['nuts', 'tree-nuts'],
    'shellfish': ['shellfish', 'crustaceans', 'molluscs'],
    'crustaceans': ['shellfish', 'crustaceans', 'molluscs'],
    'molluscs': ['shellfish', 'crustaceans', 'molluscs']
  };
  
  const synonyms1 = allergenSynonyms[allergen1.toLowerCase()] || [allergen1.toLowerCase()];
  const synonyms2 = allergenSynonyms[allergen2.toLowerCase()] || [allergen2.toLowerCase()];
  
  // Check if there's any overlap between the synonym groups
  return synonyms1.some(syn1 => synonyms2.includes(syn1));
};

/**
 * Check if an item contains any of the filtered allergens (including synonyms)
 * @param {Object} item - Inventory item
 * @param {Array} filterAllergens - Array of allergens to filter out
 * @returns {boolean} - Whether the item contains any filtered allergens
 */
export const itemContainsFilteredAllergens = (item, filterAllergens) => {
  if (!filterAllergens || filterAllergens.length === 0) {
    return false;
  }
  
  const itemAllergens = getAllergens(item);
  
  return itemAllergens.some(itemAllergen => {
    return filterAllergens.some(filterAllergen => {
      // Direct match
      if (itemAllergen.toLowerCase() === filterAllergen.toLowerCase()) {
        return true;
      }
      
      // Check for synonyms
      return areAllergensSynonyms(itemAllergen, filterAllergen);
    });
  });
};

/**
 * Get enhanced dietary tags
 * @param {Object} item - Inventory item
 * @returns {Array} - Combined dietary tags
 */
export const getDietaryTags = (item) => {
  const baseTags = item.tags || [];
  const offTags = item.openFoodFactsData?.labels 
    ? extractDietaryTags(item.openFoodFactsData.labels) 
    : [];
  
  // Combine and deduplicate tags
  const combined = [...baseTags, ...offTags];
  return [...new Set(combined)];
};

/**
 * Extract dietary tags from OpenFoodFacts labels
 * @param {Array} labels - OpenFoodFacts label tags
 * @returns {Array} - Dietary tags
 */
const extractDietaryTags = (labels) => {
  const tagMap = {
    'en:vegetarian': 'Vegetarian',
    'en:vegan': 'Vegan',
    'en:gluten-free': 'Gluten-Free',
    'en:organic': 'Organic',
    'en:fair-trade': 'Fair Trade',
    'en:kosher': 'Kosher',
    'en:halal': 'Halal'
  };

  return labels
    .map(label => tagMap[label])
    .filter(tag => tag);
};

/**
 * Get nutritional information with OpenFoodFacts data
 * @param {Object} item - Inventory item
 * @returns {Object} - Enhanced nutritional info
 */
export const getNutritionalInfo = (item) => {
  const baseNutrition = item.nutritionalInfo || {};
  const offNutrition = item.openFoodFactsData?.nutritionalInfo || {};
  
  return {
    ...baseNutrition,
    ...offNutrition
  };
};

/**
 * Create a fallback image based on product category
 * @param {string} category - Product category
 * @returns {string} - Emoji or fallback character
 */
export const getCategoryIcon = (category) => {
  const iconMap = {
    'grains': '🌾',
    'canned-goods': '🥫',
    'dairy': '🥛',
    'spreads': '🥜',
    'fresh-produce': '🥕',
    'meat': '🥩',
    'frozen': '🧊',
    'snacks': '🍿',
    'beverages': '🥤'
  };
  
  return iconMap[category] || '📦';
};

/**
 * Format product name for better display
 * @param {Object} item - Inventory item
 * @returns {string} - Formatted product name
 */
export const getDisplayName = (item) => {
  if (item.brand && !item.name.toLowerCase().includes(item.brand.toLowerCase())) {
    return `${item.brand} ${item.name}`;
  }
  return item.name;
};