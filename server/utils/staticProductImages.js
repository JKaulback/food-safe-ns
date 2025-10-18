/**
 * Static product image mappings for popular food items
 * These are real OpenFoodFacts image URLs for common products
 */
const PRODUCT_IMAGE_MAP = {
  // Jif Peanut Butter
  'jif_peanut_butter': 'https://images.openfoodfacts.org/images/products/051/500/25515/front_en.16.400.jpg',
  
  // Barilla Pasta
  'barilla_whole_grain_pasta': 'https://images.openfoodfacts.org/images/products/076/808/50000/front_en.125.400.jpg',
  
  // Bush's Black Beans
  'bushs_black_beans': 'https://images.openfoodfacts.org/images/products/003/960/06270/front_en.95.400.jpg',
  
  // Green Giant Corn
  'green_giant_sweet_corn': 'https://images.openfoodfacts.org/images/products/020/000/14697/front_en.117.400.jpg',
  
  // StarKist Tuna
  'starkist_tuna': 'https://images.openfoodfacts.org/images/products/001/120/13421/front_en.80.400.jpg',
  
  // Wonder Bread
  'wonder_whole_wheat_bread': 'https://images.openfoodfacts.org/images/products/007/286/00047/front_en.22.400.jpg',
  
  // Hunt's Diced Tomatoes
  'hunts_diced_tomatoes': 'https://images.openfoodfacts.org/images/products/002/700/00309/front_en.99.400.jpg',
  
  // Uncle Ben's Rice
  'uncle_bens_brown_rice': 'https://images.openfoodfacts.org/images/products/054/800/02500/front_en.104.400.jpg',
  
  // Carnation Evaporated Milk
  'carnation_evaporated_milk': 'https://images.openfoodfacts.org/images/products/001/280/00057/front_en.85.400.jpg',
  
  // Aunt Jemima Pancake Mix
  'aunt_jemima_pancake_mix': 'https://images.openfoodfacts.org/images/products/001/930/00210/front_en.42.400.jpg'
};

/**
 * Generate a product key for image lookup
 * @param {Object} item - Inventory item
 * @returns {string} - Product key for image mapping
 */
function generateProductKey(item) {
  const brand = (item.brand || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const name = (item.name || '').toLowerCase()
    .replace(/whole grain/g, 'whole_grain')
    .replace(/sweet corn/g, 'sweet_corn')
    .replace(/diced tomatoes/g, 'diced_tomatoes')
    .replace(/brown rice/g, 'brown_rice')
    .replace(/evaporated milk/g, 'evaporated_milk')
    .replace(/pancake mix/g, 'pancake_mix')
    .replace(/peanut butter/g, 'peanut_butter')
    .replace(/black beans/g, 'black_beans')
    .replace(/tuna in water/g, 'tuna')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  return `${brand}_${name}`;
}

/**
 * Get static product image for an inventory item
 * @param {Object} item - Inventory item
 * @returns {string|null} - Image URL or null
 */
function getStaticProductImage(item) {
  const key = generateProductKey(item);
  return PRODUCT_IMAGE_MAP[key] || null;
}

/**
 * Enhance inventory item with static image data
 * @param {Object} item - Inventory item
 * @returns {Object} - Enhanced inventory item
 */
function enhanceWithStaticData(item) {
  const staticImage = getStaticProductImage(item);
  
  if (staticImage) {
    console.log(`📷 Found static image for ${item.brand} ${item.name}: ${staticImage}`);
    
    return {
      ...item,
      image: staticImage,
      openFoodFactsData: {
        source: 'static_mapping',
        imageSource: 'openfoodfacts'
      }
    };
  }
  
  return item;
}

module.exports = {
  PRODUCT_IMAGE_MAP,
  generateProductKey,
  getStaticProductImage,
  enhanceWithStaticData
};