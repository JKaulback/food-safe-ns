import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { foodBankAPI, inventoryAPI, apiUtils } from '../services/api';
import { getProductImage, getAllergens, getDietaryTags, getCategoryIcon, getDisplayName } from '../utils/productUtils';

const FoodBankDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [foodBank, setFoodBank] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Inventory filters
  const [allergenFilter, setAllergenFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadFoodBankDetails = useCallback(async () => {
    try {
      setLoading(true);
      const details = await foodBankAPI.getFoodBankById(id);
      setFoodBank(details);
    } catch (error) {
      console.error('Error loading food bank details:', error);
      setError(apiUtils.handleApiError(error));
      
      // Fallback to mock data for development
      setFoodBank({
        id: id,
        name: 'Halifax Community Food Bank',
        address: '1131 Barrington Street, Halifax, NS B3J 1Z5',
        phone: '(902) 457-1900',
        website: 'https://halifaxfoodbank.ca',
        distance: '2.3 km',
        formattedDistance: '2.3 km away',
        formattedHours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
        hours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
        availabilityStatus: 'high',
        availabilityText: '247 items available',
        servesArea: 'Halifax Regional Municipality',
        description: 'The Halifax Community Food Bank provides emergency food assistance to individuals and families in need throughout the Halifax Regional Municipality.',
        services: ['Emergency Food Hampers', 'Fresh Produce Program', 'Children\'s Programming', 'Nutrition Education'],
        requirements: 'Photo ID and proof of address required. Clients can visit once per week.'
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadInventory = useCallback(async () => {
    try {
      setInventoryLoading(true);
      const inventoryData = await inventoryAPI.getInventory(id, {
        allergens: allergenFilter,
        category: categoryFilter
      });
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading inventory:', error);
      
      // Fallback to mock inventory data with real working OpenFoodFacts images
      const fallbackData = [
        {
          id: 'item-1',
          name: 'Spaghetti Pasta',
          category: 'grains',
          quantity: 26,
          allergens: ['gluten'],
          expiryDate: '2025-12-31',
          image: 'https://images.openfoodfacts.org/images/products/807/680/019/5057/front_en.3428.400.jpg',
          tags: ['Vegetarian', 'Vegan'],
          brand: 'Barilla'
        },
        {
          id: 'item-2',
          name: 'Nutella Spread',
          category: 'spreads',
          quantity: 48,
          allergens: ['milk', 'nuts'],
          expiryDate: '2025-08-15',
          image: 'https://images.openfoodfacts.org/images/products/301/762/401/0701/front_en.54.400.jpg',
          tags: ['Contains Nuts'],
          brand: 'Ferrero'
        },
        {
          id: 'item-3',
          name: 'Chocolate Cookies',
          category: 'snacks',
          quantity: 12,
          allergens: ['milk', 'gluten'],
          expiryDate: '2025-06-10',
          image: 'https://images.openfoodfacts.org/images/products/762/221/098/9604/front_en.11.400.jpg',
          tags: ['Contains Dairy', 'Contains Gluten'],
          brand: 'Cadbury'
        },
        {
          id: 'item-4',
          name: 'Test Product',
          category: 'other',
          quantity: 15,
          allergens: [],
          expiryDate: '2025-09-08',
          image: 'https://picsum.photos/300/200?random=4',
          tags: ['Test Item'],
          brand: 'Test Brand'
        }
      ];
      
      console.log('Setting fallback inventory data:', fallbackData);
      console.log('First item image URL:', fallbackData[0].image);
      setInventory(fallbackData);
    } finally {
      setInventoryLoading(false);
    }
  }, [id, allergenFilter, categoryFilter]);

  useEffect(() => {
    loadFoodBankDetails();
  }, [loadFoodBankDetails]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadInventory();
    }
  }, [activeTab, loadInventory]);

  const handleAllergenToggle = (allergen) => {
    setAllergenFilter(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !foodBank) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: '#fee2e2',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid #fecaca'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            Food Bank Not Found
          </h2>
          <p style={{ color: '#991b1b', marginBottom: '1rem' }}>
            {error || 'The requested food bank could not be found.'}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="food-bank-details">
      {/* Header Section */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '2rem 0' }}>
        <div className="container">
          <button 
            onClick={() => navigate('/')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary-green)', 
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            ← Back to Search
          </button>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
                {foodBank.name}
              </h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📍</span>
                  <span>{foodBank.address}</span>
                </div>
                
                {foodBank.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📞</span>
                    <a href={`tel:${foodBank.phone}`} style={{ color: 'var(--primary-green)' }}>
                      {foodBank.phone}
                    </a>
                  </div>
                )}
                
                {foodBank.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🌐</span>
                    <a href={foodBank.website} target="_blank" rel="noopener noreferrer" 
                       style={{ color: 'var(--primary-green)' }}>
                      Visit Website
                    </a>
                  </div>
                )}
                
                {foodBank.distance && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📏</span>
                    <span>{foodBank.formattedDistance || foodBank.distance}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              minWidth: '250px'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
                Quick Info
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <strong>Hours:</strong>
                  <div style={{ marginTop: '0.25rem', color: 'var(--text-gray)' }}>
                    {foodBank.formattedHours || 
                     (typeof foodBank.hours === 'string' ? foodBank.hours : 'Call for hours')}
                  </div>
                </div>
                
                <div>
                  <strong>Availability:</strong>
                  <div style={{ 
                    marginTop: '0.25rem', 
                    color: foodBank.availabilityStatus === 'high' ? '#059669' : 
                           foodBank.availabilityStatus === 'moderate' ? '#d97706' : '#dc2626'
                  }}>
                    {foodBank.availabilityText || 'Contact for availability'}
                  </div>
                </div>
                
                {foodBank.servesArea && (
                  <div>
                    <strong>Service Area:</strong>
                    <div style={{ marginTop: '0.25rem', color: 'var(--text-gray)' }}>
                      {foodBank.servesArea}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                fontSize: '1rem',
                fontWeight: activeTab === 'overview' ? '600' : '400',
                color: activeTab === 'overview' ? 'var(--primary-green)' : 'var(--text-gray)',
                borderBottom: activeTab === 'overview' ? '2px solid var(--primary-green)' : 'none',
                cursor: 'pointer'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                background: 'none',
                border: 'none',
                padding: '1rem 0',
                fontSize: '1rem',
                fontWeight: activeTab === 'inventory' ? '600' : '400',
                color: activeTab === 'inventory' ? 'var(--primary-green)' : 'var(--text-gray)',
                borderBottom: activeTab === 'inventory' ? '2px solid var(--primary-green)' : 'none',
                cursor: 'pointer'
              }}
            >
              Inventory
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                About {foodBank.name}
              </h2>
              
              {foodBank.description && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-gray)' }}>
                    {foodBank.description}
                  </p>
                </div>
              )}
              
              {foodBank.services && foodBank.services.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Services Offered
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {foodBank.services.map((service, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'var(--primary-green)',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {foodBank.requirements && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Requirements
                  </h3>
                  <p style={{ lineHeight: '1.6', color: 'var(--text-gray)' }}>
                    {foodBank.requirements}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div>
              {/* Real-time Inventory Notice */}
              <div style={{
                backgroundColor: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e40af', fontSize: '0.875rem' }}>
                    Real-time Inventory
                  </div>
                  <div style={{ color: '#1e40af', fontSize: '0.75rem' }}>
                    This inventory is updated in real-time. Click on any item to see detailed nutritional information and allergen details.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  Current Inventory
                </h2>
                
                {/* Inventory Filters */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    <option value="">All Categories</option>
                    <option value="fresh-produce">Fresh Produce</option>
                    <option value="canned-goods">Canned Goods</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat & Protein</option>
                    <option value="grains">Grains & Bread</option>
                    <option value="spreads">Spreads</option>
                    <option value="frozen">Frozen Items</option>
                  </select>
                </div>
              </div>
              
              {/* Allergen Filters */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Filter by Allergens (exclude these):
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['gluten', 'dairy', 'nuts', 'peanuts', 'soy', 'eggs', 'fish', 'shellfish'].map(allergen => (
                    <button
                      key={allergen}
                      onClick={() => handleAllergenToggle(allergen)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: `1px solid ${allergenFilter.includes(allergen) ? 'var(--primary-green)' : '#d1d5db'}`,
                        backgroundColor: allergenFilter.includes(allergen) ? 'var(--primary-green)' : 'white',
                        color: allergenFilter.includes(allergen) ? 'white' : 'var(--text-dark)',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Inventory Grid */}
              {inventoryLoading ? (
                <LoadingSpinner />
              ) : inventory.length > 0 ? (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {inventory
                    .filter(item => !categoryFilter || item.category === categoryFilter)
                    .filter(item => allergenFilter.length === 0 || !getAllergens(item).some(allergen => allergenFilter.includes(allergen)))
                    .map(item => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        {/* Product Image */}
                        <div style={{
                          width: '100%',
                          height: '200px',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          backgroundImage: getProductImage(item) ? `url(${getProductImage(item)})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}>
                          {!getProductImage(item) && (
                            <div style={{
                              fontSize: '3rem',
                              color: '#9ca3af'
                            }}>
                              {getCategoryIcon(item.category)}
                            </div>
                          )}
                          
                          {/* Quantity Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: item.quantity > 20 ? '#10b981' : item.quantity > 10 ? '#f59e0b' : '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {item.quantity}
                          </div>
                        </div>

                        {/* Card Content */}
                        <div style={{ padding: '1rem' }}>
                          {/* Product Name */}
                          <h3 style={{ 
                            fontSize: '1rem', 
                            fontWeight: '600', 
                            marginBottom: '0.5rem',
                            color: '#111827',
                            lineHeight: '1.4'
                          }}>
                            {getDisplayName(item)}
                          </h3>
                          
                          {/* Brand and Category */}
                          <div style={{ 
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            marginBottom: '0.75rem'
                          }}>
                            {item.brand && <span>{item.brand}</span>}
                            {item.brand && item.category && <span> • </span>}
                            <span style={{ textTransform: 'capitalize' }}>
                              {item.category?.replace('-', ' ')}
                            </span>
                          </div>

                          {/* Dietary Tags */}
                          {getDietaryTags(item).length > 0 && (
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: '0.5rem',
                              marginBottom: '0.75rem'
                            }}>
                              {getDietaryTags(item).map(tag => {
                                let tagColor = '#10b981'; // Default green for Vegetarian
                                if (tag === 'Vegan') tagColor = '#059669';
                                if (tag === 'Gluten-Free') tagColor = '#0891b2';
                                if (tag === 'Organic') tagColor = '#65a30d';
                                
                                return (
                                  <span
                                    key={tag}
                                    style={{
                                      fontSize: '0.75rem',
                                      backgroundColor: tagColor,
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: '10px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Allergen Warning */}
                          {getAllergens(item).length > 0 && (
                            <div style={{ 
                              backgroundColor: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '6px',
                              padding: '0.5rem',
                              marginBottom: '0.75rem'
                            }}>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#dc2626', 
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                ⚠️ Contains:
                              </div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {getAllergens(item).map(allergen => (
                                  <span
                                    key={allergen}
                                    style={{
                                      fontSize: '0.75rem',
                                      backgroundColor: '#dc2626',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '8px',
                                      fontWeight: '500',
                                      textTransform: 'capitalize'
                                    }}
                                  >
                                    {allergen}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Expiry Date */}
                          {item.expiryDate && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              📅 Best by: {new Date(item.expiryDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'var(--text-gray)' }}>
                    No inventory items found matching your filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FoodBankDetails;