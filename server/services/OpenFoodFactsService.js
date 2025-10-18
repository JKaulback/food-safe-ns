const axios = require('axios');

class OpenFoodFactsService {
  constructor() {
    this.baseURL = 'https://world.openfoodfacts.org/api/v0/product';
    this.searchURL = 'https://world.openfoodfacts.org/cgi/search.pl';
  }

  /**
   * Search for products by name and brand
   * @param {string} productName - The product name to search for
   * @param {string} brand - The brand name (optional)
   * @returns {Promise<Array>} - Array of matching products
   */
  async searchProducts(productName, brand = '') {
    try {
      const searchTerm = brand ? `${brand} ${productName}` : productName;
      
      console.log(`🔍 Searching OpenFoodFacts for: "${searchTerm}"`);
      
      const response = await axios.get(this.searchURL, {
        params: {
          search_terms: searchTerm,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 5,
          fields: 'code,product_name,brands,image_url,image_front_url,nutriments,allergens_tags,labels_tags,categories_tags'
        },
        timeout: 8000 // Increased timeout
      });

      if (response.data && response.data.products) {
        const products = response.data.products.map(product => this.formatProduct(product));
        console.log(`✅ Found ${products.length} products for "${searchTerm}"`);
        return products;
      }
      
      console.log(`❌ No products found for "${searchTerm}"`);
      return [];
    } catch (error) {
      console.error(`❌ Error searching OpenFoodFacts for "${productName}":`, error.message);
      return [];
    }
  }

  /**
   * Get product details by barcode
   * @param {string} barcode - The product barcode
   * @returns {Promise<Object|null>} - Product details or null
   */
  async getProductByBarcode(barcode) {
    try {
      const response = await axios.get(`${this.baseURL}/${barcode}.json`, {
        timeout: 5000
      });

      if (response.data && response.data.product) {
        return this.formatProduct(response.data.product);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product from OpenFoodFacts:', error.message);
      return null;
    }
  }

  /**
   * Format OpenFoodFacts product data to our schema
   * @param {Object} product - Raw OpenFoodFacts product data
   * @returns {Object} - Formatted product data
   */
  formatProduct(product) {
    return {
      barcode: product.code,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || '',
      image: this.getBestImage(product),
      allergens: this.extractAllergens(product.allergens_tags || []),
      categories: product.categories_tags || [],
      labels: product.labels_tags || [],
      nutritionalInfo: product.nutriments || {}
    };
  }

  /**
   * Get the best available image from OpenFoodFacts product data
   * @param {Object} product - Raw OpenFoodFacts product data
   * @returns {string|null} - Best image URL or null
   */
  getBestImage(product) {
    // Priority: front image > general image > null
    if (product.image_front_url && this.isValidImageUrl(product.image_front_url)) {
      return product.image_front_url;
    }
    
    if (product.image_url && this.isValidImageUrl(product.image_url)) {
      return product.image_url;
    }
    
    return null;
  }

  /**
   * Check if an image URL is valid and accessible
   * @param {string} url - Image URL to validate
   * @returns {boolean} - Whether the URL appears valid
   */
  isValidImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Basic URL validation
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Extract and format allergens from OpenFoodFacts tags
   * @param {Array} allergenTags - Raw allergen tags from OpenFoodFacts
   * @returns {Array} - Formatted allergen list
   */
  extractAllergens(allergenTags) {
    const allergenMap = {
      'en:gluten': 'gluten',
      'en:milk': 'dairy',
      'en:eggs': 'eggs',
      'en:fish': 'fish',
      'en:crustaceans': 'shellfish',
      'en:molluscs': 'shellfish',
      'en:tree-nuts': 'nuts',
      'en:peanuts': 'peanuts',
      'en:soybeans': 'soy',
      'en:sesame-seeds': 'sesame',
      'en:sulphur-dioxide-and-sulphites': 'sulfites'
    };

    return allergenTags
      .map(tag => allergenMap[tag])
      .filter(allergen => allergen)
      .filter((allergen, index, self) => self.indexOf(allergen) === index); // Remove duplicates
  }

  /**
   * Get enhanced product data for inventory items
   * @param {Object} inventoryItem - Current inventory item
   * @returns {Promise<Object>} - Enhanced inventory item with OpenFoodFacts data
   */
  async enhanceInventoryItem(inventoryItem) {
    try {
      console.log(`🔧 Enhancing inventory item: ${inventoryItem.brand || ''} ${inventoryItem.name}`);
      
      // First try searching by brand and product name
      let products = await this.searchProducts(inventoryItem.name, inventoryItem.brand);
      
      if (products.length === 0 && inventoryItem.brand) {
        // If no results with brand, try just product name
        console.log(`🔄 Retrying search without brand for: ${inventoryItem.name}`);
        products = await this.searchProducts(inventoryItem.name);
      }

      if (products.length > 0) {
        const bestMatch = products[0]; // Take the first/best match
        
        console.log(`✅ Enhanced ${inventoryItem.name} with OpenFoodFacts data`);
        console.log(`📷 Image URL: ${bestMatch.image || 'No image found'}`);
        
        return {
          ...inventoryItem,
          image: bestMatch.image || inventoryItem.image,
          barcode: bestMatch.barcode,
          openFoodFactsData: {
            allergens: bestMatch.allergens,
            categories: bestMatch.categories,
            labels: bestMatch.labels,
            nutritionalInfo: bestMatch.nutritionalInfo
          }
        };
      }

      console.log(`⚠️ No OpenFoodFacts data found for: ${inventoryItem.name}`);
      return inventoryItem;
    } catch (error) {
      console.error(`❌ Error enhancing inventory item "${inventoryItem.name}":`, error.message);
      return inventoryItem;
    }
  }

  /**
   * Get dietary tags from OpenFoodFacts labels
   * @param {Array} labels - Label tags from OpenFoodFacts
   * @returns {Array} - Dietary tags (Vegetarian, Vegan, etc.)
   */
  getDietaryTags(labels) {
    const dietaryTags = [];
    
    const tagMap = {
      'en:vegetarian': 'Vegetarian',
      'en:vegan': 'Vegan',
      'en:gluten-free': 'Gluten-Free',
      'en:organic': 'Organic',
      'en:fair-trade': 'Fair Trade',
      'en:kosher': 'Kosher',
      'en:halal': 'Halal'
    };

    labels.forEach(label => {
      if (tagMap[label]) {
        dietaryTags.push(tagMap[label]);
      }
    });

    return dietaryTags;
  }
}

module.exports = new OpenFoodFactsService();