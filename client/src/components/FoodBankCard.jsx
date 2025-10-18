import React from 'react';
import { Link } from 'react-router-dom';

const FoodBankCard = ({ foodBank }) => {
  const {
    id,
    name,
    distance,
    address,
    phone,
    hours,
    formattedHours,
    tags,
    inventoryCount,
    availabilityStatus
  } = foodBank;

  const getAvailabilityBadge = (status, count) => {
    let badgeText = `${count} items`;
    let badgeColor = 'var(--primary-green)';
    
    if (status === 'low') {
      badgeColor = 'var(--warning-yellow)';
    } else if (status === 'empty') {
      badgeColor = 'var(--error-red)';
      badgeText = 'Low Stock';
    }
    
    return { badgeText, badgeColor };
  };

  const { badgeText, badgeColor } = getAvailabilityBadge(availabilityStatus, inventoryCount);

  return (
    <div className="food-bank-card">
      <div className="food-bank-header">
        <div>
          <h3 className="food-bank-title">{name}</h3>
          <div className="food-bank-distance">
            ✅ {distance}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span 
            className="inventory-badge"
            style={{ backgroundColor: badgeColor }}
          >
            {badgeText}
          </span>
        </div>
      </div>

      <div className="food-bank-info">
        <div className="info-row">
          <span>📍</span>
          <span>{address}</span>
        </div>
        <div className="info-row">
          <span>📞</span>
          <span>{phone}</span>
        </div>
        <div className="info-row">
          <span>🕒</span>
          <span>{formattedHours || hours || 'Hours not available'}</span>
        </div>
      </div>

      <div className="food-bank-tags">
        {tags && tags.length > 0 ? (
          <>
            {tags.slice(0, 6).map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
            {tags.length > 6 && (
              <span className="tag">+{tags.length - 6} more</span>
            )}
          </>
        ) : (
          <span className="tag">No tags available</span>
        )}
      </div>

      <Link to={`/foodbank/${id}`}>
        <button className="view-inventory-button">
          View Inventory
        </button>
      </Link>
    </div>
  );
};

export default FoodBankCard;