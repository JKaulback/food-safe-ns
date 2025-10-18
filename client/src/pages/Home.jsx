import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import FoodBankCard from '../components/FoodBankCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { foodBankAPI, apiUtils } from '../services/api';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchData) => {
    setLoading(true);
    setSearchPerformed(true);
    setError('');
    
    try {
      // Call the real API
      const results = await foodBankAPI.searchFoodBanks({
        location: searchData.location,
        radius: searchData.radius || 50,
        allergens: searchData.allergens,
        cultural: searchData.cultural
      });
      
      // Format results for display
      const formattedResults = apiUtils.formatSearchResults(results);
      setSearchResults(formattedResults);
      
    } catch (error) {
      console.error('Search error:', error);
      setError(apiUtils.handleApiError(error));
      
      // Fallback to mock data for development if API fails
      setSearchResults([
        {
          id: 'halifax-fb-1',
          name: 'Halifax Community Fridge',
          distance: '2.3 km away',
          address: '1491 Carlton St, Halifax, NS B3H 3B7',
          phone: '(902) 457-1900',
          hours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          tags: ['Canned Goods', 'Fresh Produce', 'Dairy', 'Frozen Items', 'Gluten-Free', 'Halal'],
          inventoryCount: 247,
          availabilityStatus: 'high',
          formattedDistance: '2.3 km away',
          formattedHours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          availabilityText: '247 items available'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Find Nutritious Food Near You</h1>
          <p className="hero-subtitle">
            Connect with local food banks and discover available items that meet your dietary needs
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Features Section (shown when no search performed) */}
      {!searchPerformed && (
        <>
          <section className="features-section">
            <div className="container">
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3 className="feature-title">Find Food Banks</h3>
                  <p className="feature-description">
                    Search for food banks near you and see real-time availability
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h3 className="feature-title">Filter by Dietary Needs</h3>
                  <p className="feature-description">
                    Find safe food options that match your dietary requirements and allergies
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📦</div>
                  <h3 className="feature-title">Browse Inventory</h3>
                  <p className="feature-description">
                    See what's in stock before you visit, including nutritional information
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="container">
              <h2 className="stats-title">Addressing Food Insecurity in Nova Scotia</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">30%</div>
                  <div className="stat-description">
                    of Nova Scotians experiencing food insecurity (2025)
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">68%</div>
                  <div className="stat-description">
                    increase in food bank usage since 2021
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-description">
                    committed to connecting those in need with resources
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Search Results Section */}
      {searchPerformed && (
        <section className="search-results-section" style={{ padding: '2rem 0' }}>
          <div className="container">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Search Error</h3>
                <p style={{ color: '#991b1b', marginBottom: '1rem' }}>{error}</p>
                <button 
                  onClick={() => setError('')}
                  style={{
                    backgroundColor: 'var(--primary-green)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <button 
                    onClick={() => setSearchPerformed(false)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--primary-green)', 
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    ← Back to Search
                  </button>
                  <h2 style={{ margin: '1rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
                    Food Banks Near B3K 2T4
                  </h2>
                  <p style={{ color: 'var(--text-gray)' }}>
                    Found {searchResults.length} food banks
                  </p>
                </div>
                
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {searchResults.map(foodBank => (
                    <FoodBankCard key={foodBank.id} foodBank={foodBank} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;