import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid var(--border-light)',
        borderTop: '4px solid var(--primary-green)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Finding food banks near you...</p>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;