import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(25); // Default radius in km
  const [showFilters, setShowFilters] = useState(false);
  const [allergenFilters, setAllergenFilters] = useState([]);
  const [culturalFilters, setCulturalFilters] = useState([]);

  const allergens = [
    'gluten-free', 'dairy-free', 'nut-free', 'soy-free', 
    'egg-free', 'shellfish-free', 'sesame-free'
  ];

  const culturalOptions = [
    'halal', 'kosher', 'vegan', 'vegetarian', 'organic'
  ];

  const radiusOptions = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 15, label: '15 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      location,
      radius,
      allergens: allergenFilters,
      cultural: culturalFilters
    });
  };

  const toggleAllergen = (allergen) => {
    setAllergenFilters(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleCultural = (cultural) => {
    setCulturalFilters(prev => 
      prev.includes(cultural) 
        ? prev.filter(c => c !== cultural)
        : [...prev, cultural]
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <input
            type="text"
            placeholder="Enter your postal code or city (e.g., Halifax, B3K 2T4)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
            style={{ flex: '1', minWidth: '200px' }}
          />
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            minWidth: '120px'
          }}>
            <label style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-gray)', 
              whiteSpace: 'nowrap',
              fontWeight: '500'
            }}>
              Radius:
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                border: '1px solid var(--border-gray)',
                borderRadius: '4px',
                fontSize: '0.875rem',
                background: 'white',
                minWidth: '70px',
                cursor: 'pointer'
              }}
            >
              {radiusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="search-button">
            Search
          </button>
          <button 
            type="button" 
            onClick={() => setShowFilters(!showFilters)}
            className="filters-button"
          >
            🔽 Dietary Filters
          </button>
        </div>
      </form>

      {showFilters && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '8px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
              Allergen-Safe Options
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {allergens.map(allergen => (
                <label 
                  key={allergen}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: `1px solid ${allergenFilters.includes(allergen) ? 'var(--primary-green)' : 'var(--border-gray)'}`,
                    borderRadius: '20px',
                    background: allergenFilters.includes(allergen) ? 'var(--primary-green)' : 'white',
                    color: allergenFilters.includes(allergen) ? 'white' : 'var(--text-gray)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allergenFilters.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    style={{ display: 'none' }}
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
              Cultural & Dietary Preferences
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {culturalOptions.map(cultural => (
                <label 
                  key={cultural}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: `1px solid ${culturalFilters.includes(cultural) ? 'var(--primary-green)' : 'var(--border-gray)'}`,
                    borderRadius: '20px',
                    background: culturalFilters.includes(cultural) ? 'var(--primary-green)' : 'white',
                    color: culturalFilters.includes(cultural) ? 'white' : 'var(--text-gray)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={culturalFilters.includes(cultural)}
                    onChange={() => toggleCultural(cultural)}
                    style={{ display: 'none' }}
                  />
                  {cultural}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;