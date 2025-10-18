const axios = require('axios');

// Simple test script to verify OpenFoodFacts integration
async function testOpenFoodFacts() {
  console.log('🧪 Testing OpenFoodFacts API integration...\n');

  const testProducts = [
    { name: 'Peanut Butter', brand: 'Jif' },
    { name: 'Whole Grain Pasta', brand: 'Barilla' },
    { name: 'Black Beans', brand: "Bush's" },
    { name: 'Sweet Corn', brand: 'Green Giant' },
    { name: 'Tuna in Water', brand: 'StarKist' }
  ];

  for (const product of testProducts) {
    try {
      console.log(`🔍 Searching for: ${product.brand} ${product.name}`);
      
      const searchTerm = `${product.brand} ${product.name}`;
      const response = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
        params: {
          search_terms: searchTerm,
          search_simple: 1,
          action: 'process',
          json: 1,
          page_size: 3,
          fields: 'code,product_name,brands,image_url,image_front_url,allergens_tags,labels_tags'
        },
        timeout: 5000
      });

      if (response.data && response.data.products && response.data.products.length > 0) {
        const foundProduct = response.data.products[0];
        console.log(`  ✅ Found: ${foundProduct.product_name || 'Unknown'}`);
        console.log(`  📷 Image: ${foundProduct.image_front_url || foundProduct.image_url || 'No image'}`);
        console.log(`  🏷️  Brands: ${foundProduct.brands || 'Unknown'}`);
        console.log(`  ⚠️  Allergens: ${foundProduct.allergens_tags ? foundProduct.allergens_tags.join(', ') : 'None listed'}`);
        console.log(`  🥗 Labels: ${foundProduct.labels_tags ? foundProduct.labels_tags.slice(0, 3).join(', ') : 'None listed'}`);
      } else {
        console.log(`  ❌ No products found for ${product.brand} ${product.name}`);
      }
      
      console.log(''); // Empty line for readability
      
      // Add delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`  ❌ Error searching for ${product.brand} ${product.name}: ${error.message}`);
      console.log('');
    }
  }

  console.log('🏁 OpenFoodFacts API test completed!');
}

// Run the test
if (require.main === module) {
  testOpenFoodFacts().catch(console.error);
}

module.exports = testOpenFoodFacts;