import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FoodBankCard from '../components/FoodBankCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { foodBankAPI, apiUtils } from '../services/api';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'

  // Check server connectivity on component mount
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/test`);
      if (response.ok) {
        setServerStatus('connected');
        console.log('✅ Server connection successful');
      } else {
        setServerStatus('disconnected');
        console.warn('⚠️ Server responded but with error status');
      }
    } catch (error) {
      setServerStatus('disconnected');
      console.warn('⚠️ Server connection failed:', error.message);
    }
  };

  const handleSearch = async (searchData) => {
    setLoading(true);
    setSearchPerformed(true);
    setError('');
    
    // If server is disconnected, skip API call and use demo data immediately
    if (serverStatus === 'disconnected') {
      console.log('🔄 Server offline, using demo data');
      setSearchResults([
        {
          id: 'halifax-fb-1',
          name: 'Halifax Community Food Bank (Demo)',
          distance: '2.3 km away',
          address: '1131 Barrington Street, Halifax, NS B3J 1Z5',
          phone: '(902) 457-1900',
          hours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          tags: ['Canned Goods', 'Fresh Produce', 'Dairy', 'Frozen Items', 'Gluten-Free', 'Halal'],
          inventoryCount: 247,
          availabilityStatus: 'high',
          formattedDistance: '2.3 km away',
          formattedHours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          availabilityText: '247 items available'
        },
        {
          id: 'dartmouth-fb-1',
          name: 'Dartmouth Food Bank (Demo)',
          distance: '5.7 km away',
          address: '4 Dundas Street, Dartmouth, NS B2Y 2V1',
          phone: '(902) 466-2042',
          hours: 'Tue-Thu: 10AM-4PM',
          tags: ['Emergency Food', 'Family Support', 'Dairy-Free', 'Vegetarian'],
          inventoryCount: 156,
          availabilityStatus: 'moderate',
          formattedDistance: '5.7 km away',
          formattedHours: 'Tue-Thu: 10AM-4PM',
          availabilityText: '156 items - Good selection'
        }
      ]);
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Attempting to search food banks with API...', {
        url: process.env.REACT_APP_API_URL,
        searchData
      });
      
      // Call the real API
      const results = await foodBankAPI.searchFoodBanks({
        location: searchData.location,
        radius: searchData.radius || 15,
        allergens: searchData.allergens,
        cultural: searchData.cultural
      });
      
      console.log('✅ API search successful:', results);
      
      // Format results for display
      const formattedResults = apiUtils.formatSearchResults(results);
      setSearchResults(formattedResults);
      
    } catch (error) {
      console.error('❌ API search failed:', error);
      
      // Update server status if connection failed
      setServerStatus('disconnected');
      
      // Check if it's a network/server connectivity issue
      if (error.message?.includes('Network error') || error.message?.includes('connect')) {
        setError('Server connection lost. Using demo data for now. Please start the backend server on port 3000.');
        console.warn('⚠️ Server unavailable, showing demo data');
      } else {
        setError(apiUtils.handleApiError(error));
      }
      
      // Fallback to mock data for development when server is not running
      setSearchResults([
        {
          id: 'halifax-fb-1',
          name: 'Halifax Community Food Bank (Demo)',
          distance: '2.3 km away',
          address: '1131 Barrington Street, Halifax, NS B3J 1Z5',
          phone: '(902) 457-1900',
          hours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          tags: ['Canned Goods', 'Fresh Produce', 'Dairy', 'Frozen Items', 'Gluten-Free', 'Halal'],
          inventoryCount: 247,
          availabilityStatus: 'high',
          formattedDistance: '2.3 km away',
          formattedHours: 'Mon-Fri: 9AM-4PM, Sat: 10AM-2PM',
          availabilityText: '247 items available'
        },
        {
          id: 'dartmouth-fb-1',
          name: 'Dartmouth Food Bank (Demo)',
          distance: '5.7 km away',
          address: '4 Dundas Street, Dartmouth, NS B2Y 2V1',
          phone: '(902) 466-2042',
          hours: 'Tue-Thu: 10AM-4PM',
          tags: ['Emergency Food', 'Family Support', 'Dairy-Free', 'Vegetarian'],
          inventoryCount: 156,
          availabilityStatus: 'moderate',
          formattedDistance: '5.7 km away',
          formattedHours: 'Tue-Thu: 10AM-4PM',
          availabilityText: '156 items - Good selection'
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
          
          {/* Server Status Indicator */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: serverStatus === 'connected' ? '#dcfce7' : 
                           serverStatus === 'disconnected' ? '#fee2e2' : '#f3f4f6',
            color: serverStatus === 'connected' ? '#166534' : 
                   serverStatus === 'disconnected' ? '#991b1b' : '#6b7280',
            border: `1px solid ${serverStatus === 'connected' ? '#bbf7d0' : 
                                serverStatus === 'disconnected' ? '#fecaca' : '#e5e7eb'}`
          }}>
            <span>{serverStatus === 'connected' ? '🟢' : 
                   serverStatus === 'disconnected' ? '🔴' : '🟡'}</span>
            <span>
              {serverStatus === 'connected' ? 'Live data available' : 
               serverStatus === 'disconnected' ? 'Using demo data (server offline)' : 'Checking server...'}
            </span>
            {serverStatus === 'disconnected' && (
              <button 
                onClick={checkServerConnection}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#991b1b',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '0.875rem'
                }}
              >
                Retry
              </button>
            )}
          </div>
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