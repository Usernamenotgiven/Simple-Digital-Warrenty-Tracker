import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ProductCard = ({ product }) => {
  return (
    <div className="card">
      <div className="flex justify-between align-center mb-1">
        <h3 style={{ margin: 0 }}>{product.name}</h3>
        <StatusBadge status={product.warrantyStatus} />
      </div>
      <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>{product.brand} - {product.category}</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>Purchased:</strong> {new Date(product.purchaseDate).toLocaleDateString()}</p>
        <p><strong>Warranty Ends:</strong> {new Date(product.warrantyEndDate).toLocaleDateString()}</p>
        
        {product.warrantyStatus !== 'Expired' ? (
          <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>
            {product.daysRemaining} days remaining
          </p>
        ) : (
          <p style={{ marginTop: '0.5rem', fontWeight: '500', color: '#e74c3c' }}>
            Warranty Expired
          </p>
        )}
      </div>

      <Link to={`/products/${product._id}`} className="btn btn-primary btn-block btn-sm">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
