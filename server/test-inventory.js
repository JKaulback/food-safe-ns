const InventoryService = require('./services/InventoryService');

async function testInventoryEnhancement() {
  console.log('🧪 Testing Inventory Enhancement...\n');
  
  try {
    const inventoryService = new InventoryService();
    
    // Test with halifax-fb-1 which should have items
    console.log('📦 Getting enhanced inventory for halifax-fb-1...');
    const enhancedItems = await inventoryService.getEnhancedInventory('halifax-fb-1');
    
    console.log(`✅ Retrieved ${enhancedItems.length} enhanced items:\n`);
    
    enhancedItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.brand || 'No Brand'} ${item.name}`);
      console.log(`   📷 Image: ${item.image || 'No image'}`);
      console.log(`   🏷️  Tags: ${item.tags ? item.tags.join(', ') : 'No tags'}`);
      console.log(`   ⚠️  Allergens: ${item.allergens ? item.allergens.join(', ') : 'None'}`);
      console.log(`   📊 Quantity: ${item.quantity}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testInventoryEnhancement();