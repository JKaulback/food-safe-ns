import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              FS
            </div>
            <div>
              <div className="logo-text">FoodSafe NS</div>
              <div className="logo-subtitle">Connecting Communities</div>
            </div>
          </Link>
          <div className="header-location">
            📍 Nova Scotia
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;